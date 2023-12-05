import { CustomButton, IconButton, InputFileButton } from '@components/Buttons';
import CamBox from '@components/CamBox';
import { CustomSelectOptions } from '@components/CustomSelect';
import InputText from '@components/InputText';

import { useProfileInfoContext } from '@business/hooks/useProfileInfoContext';

import DeviceSelect from './DeviceSelect';
import DeviceToggleButtons from './DeviceToggleButtons';

interface ProfileSettingProps {
  toggleVideo: () => void;
  toggleAudio: () => void;
  camList: CustomSelectOptions[];
  micList: CustomSelectOptions[];
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraConnected: { local: boolean; remote: boolean };
  audioConnected: { local: boolean; remote: boolean };
  changeMyCamera: (deviceId: string) => void;
  changeMyAudio: (deviceId: string) => void;
  onConfirm: () => void;
  onChangeProfileImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeNickname: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileSetting({
  toggleVideo,
  toggleAudio,
  camList,
  micList,
  videoRef,
  cameraConnected,
  audioConnected,
  changeMyCamera,
  changeMyAudio,
  onConfirm,
  onChangeProfileImage,
  onChangeNickname,
}: ProfileSettingProps) {
  const {
    profileInfos: { myProfile, myNickname },
  } = useProfileInfoContext();
  return (
    <div className="w-[100vw] h-[100vh] flex-with-center z-10">
      <div className="flex gap-48 rounded-lg p-64 surface-box">
        <div className="flex flex-col justify-between">
          <CamBox
            videoRef={videoRef}
            cameraConnected={cameraConnected.local}
            audioConnected={audioConnected.local}
            defaultImage="bg-ddung"
            profileInfo={myProfile}
            nickname={myNickname}
            defaultNickname="나"
          />
          <DeviceToggleButtons
            cameraActive={cameraConnected.local}
            micActive={audioConnected.local}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
          />
        </div>
        <div className="flex flex-col gap-20">
          <div className="flex-with-center gap-12">
            <div className="flex flex-col gap-4 w-240">
              <span className="text-strong display-bold14">프로필 이미지를 설정하세요.</span>
              <span className="text-strong display-medium12">카메라가 off 되었을 때 표시됩니다.</span>
            </div>
            <InputFileButton
              onChange={onChangeProfileImage}
              accept="image/*"
            >
              <IconButton
                icon="ph:camera-bold"
                iconColor="textWhite"
                iconSize={24}
                buttonSize="m"
                buttonColor="dark"
                circle
              />
            </InputFileButton>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-strong display-bold14">상대방에게 표시될 이름을 입력하세요.</span>
            <InputText onChange={onChangeNickname} />
          </div>
          <div className="z-20">
            <DeviceSelect
              name="카메라"
              deviceList={camList}
              onChange={changeMyCamera}
            />
          </div>
          <div className="z-10">
            <DeviceSelect
              name="마이크"
              deviceList={micList}
              onChange={changeMyAudio}
            />
          </div>
          <CustomButton
            onClick={onConfirm}
            color="dark"
          >
            확인
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
