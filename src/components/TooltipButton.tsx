import React, { Fragment } from 'react';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';

interface TooltipButtonProps {
  tooltipContent: React.ReactNode;
  item: React.ReactNode;
  ariaLabel: string;
}

export const TooltipButton: React.FunctionComponent<TooltipButtonProps> = ({
  tooltipContent,
  item,
  ariaLabel,
}) => {
  return (
    <Popover className="relative">
      <PopoverButton
        aria-label={ariaLabel}
        className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-200/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
      >
        {item}
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel className="absolute z-10 rounded-lg bg-white">{tooltipContent}</PopoverPanel>
      </Transition>
    </Popover>
  );
};
