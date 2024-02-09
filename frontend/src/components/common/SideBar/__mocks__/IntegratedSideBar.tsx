import { SideBarButton } from '.';
import { ContentAreaWithSideBar } from '..';

export default function IntegratedSideBar() {
  return (
    <div className="w-full h-full">
      <header>
        <SideBarButton />
      </header>
      <ContentAreaWithSideBar sideBar={<div>side bar</div>}>
        <div>content area</div>
      </ContentAreaWithSideBar>
    </div>
  );
}
