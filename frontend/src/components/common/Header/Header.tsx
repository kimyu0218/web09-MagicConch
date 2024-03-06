import { LogoButton } from '@components/common/Buttons';

interface HeaderProps {
  rightItems?: React.ReactNode[];
}

export function Header({ rightItems }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full h-48 flex justify-between items-center surface-content text-default px-8 py-5 z-20">
      <LogoButton />
      {rightItems?.map((item, index) => (
        <div
          className="flex gap-16"
          key={index}
        >
          {item}
        </div>
      ))}
    </header>
  );
}
