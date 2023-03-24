import Image from 'next/image';

export function Logo() {
  return (
    <Image src="/images/logo.png" width={193} height={24} alt="presence" />
  );
}
