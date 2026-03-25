import { twMerge } from 'tailwind-merge';

export default function BellIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={twMerge('size-4', className)}
      fill='none'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M10 2.5C7.23858 2.5 5 4.73858 5 7.5V10.5L3.5 13H16.5L15 10.5V7.5C15 4.73858 12.7614 2.5 10 2.5Z'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.6'
      />
      <path
        d='M8.5 15C8.5 15.8284 9.17157 16.5 10 16.5C10.8284 16.5 11.5 15.8284 11.5 15'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='1.6'
      />
    </svg>
  );
}

BellIcon.displayName = 'BellIcon';
