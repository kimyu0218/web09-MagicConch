import { HumanSocketManager } from '@business/services/SocketManager';
import WebRTC from '@business/services/WebRTC';

import { useMediaInfo } from '@stores/zustandStores/useMediaInfo';
import { useProfileInfo } from '@stores/zustandStores/useProfileInfo';

import { array2ArrayBuffer } from '@utils/array';

import { DEFAULT_NICKNAME } from '@constants/nickname';

export function useDataChannelEventListener() {
  const webRTC = WebRTC.getInstance(HumanSocketManager.getInstance());

  const { setRemoteMicOn, setRemoteVideoOn } = useMediaInfo(state => ({
    setRemoteMicOn: state.setRemoteMicOn,
    setRemoteVideoOn: state.setRemoteVideoOn,
  }));
  const { setRemoteNickname, setRemoteProfileImage } = useProfileInfo(state => ({
    setRemoteProfileImage: state.setRemoteProfile,
    setRemoteNickname: state.setRemoteNickname,
  }));

  async function setMediaStates({ ev: { data } }: { ev: MessageEvent<any> }) {
    const mediaInfoArray = JSON.parse(data);

    mediaInfoArray.forEach(({ type, onOrOff }: { type: string; onOrOff: boolean }) => {
      if (type === 'audio') {
        setRemoteMicOn(onOrOff);
      } else if (type === 'video') {
        setRemoteVideoOn(onOrOff);
      }
    });
  }

  function setRemoteProfileImageState({ ev: { data } }: { ev: MessageEvent<any> }) {
    const receivedData = JSON.parse(data);

    const { type, arrayBuffer: array } = receivedData;

    const arrayBuffer = array2ArrayBuffer(array);

    setRemoteProfileImage({ arrayBuffer, type });
  }

  function setRemoteNicknameState({ ev: { data } }: { ev: MessageEvent<any> }) {
    setRemoteNickname(data);
  }

  function sendNowMediaStates(this: RTCDataChannel) {
    const audioTrack = webRTC.getFirstAudioTrack();
    const videoTrack = webRTC.getFirstVideoTrack();

    this.send(
      JSON.stringify([
        { type: 'audio', onOrOff: audioTrack?.enabled },
        { type: 'video', onOrOff: videoTrack?.enabled },
      ]),
    );
  }

  function sendMyProfileImage(this: RTCDataChannel) {
    const { myProfile } = useProfileInfo.getState();
    if (!myProfile) {
      return;
    }
    this.send(JSON.stringify({ myProfile }));
  }

  function sendMyNickname(this: RTCDataChannel) {
    const { myNickname } = useProfileInfo.getState();
    if (!myNickname) {
      return;
    }
    this.send(myNickname ?? DEFAULT_NICKNAME.OTHER);
  }

  return {
    setMediaStates,
    setRemoteProfileImageState,
    setRemoteNicknameState,
    sendNowMediaStates,
    sendMyProfileImage,
    sendMyNickname,
  };
}