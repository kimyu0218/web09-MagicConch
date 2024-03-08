import { LogoButton } from '@components/common/Buttons';

interface HeaderProps {
  rightItems?: React.ReactNode[];
}

export function Header({ rightItems }: HeaderProps) {
  return (
    <header className="sticky w-full h-48 flex justify-between items-center surface-content text-default px-8 py-5 z-50">
      <LogoButton />
      <div className="flex-with-center gap-16">
        {rightItems?.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </header>
  );
}
