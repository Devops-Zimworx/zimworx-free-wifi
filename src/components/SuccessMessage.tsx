import type { Variant } from '../types';

export type SuccessMessageProps = {
  variant: Variant;
  submittedEmail?: string;
};

const variantSuccessCopy: Record<Variant, { title: string; subtitle: string; icon: string }> = {
  variant_a: {
    title: 'Nice choice!\nYou chose the\nsecure connection.',
    subtitle: 'Always verify and encrypt\nyour Wi-Fi connections\nwith a VPN.',
    icon: 'padlock-check',
  },
  variant_b: {
    title: 'Oops! You just tried\nto connect to a public\nnetwork without\nprotection.',
    subtitle: 'This could expose your passwords\nand work data. Always use\nyour VPN!',
    icon: 'warning',
  },
};

export function SuccessMessage({ variant, submittedEmail }: SuccessMessageProps) {
  const copy = variantSuccessCopy[variant];

  return (
    <section className={`success-message success-message--${variant}`}>
      <div className="success-message__icon">
        {copy.icon === 'padlock-check' ? (
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="success-message__padlock-icon"
          >
            <path
              d="M30 50V40C30 26.7452 40.7452 16 54 16H66C79.2548 16 90 26.7452 90 40V50"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="20"
              y="50"
              width="80"
              height="54"
              rx="8"
              fill="white"
            />
            <path
              d="M45 70L55 80L75 60"
              stroke="#22c55e"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="success-message__warning-icon"
          >
            <path
              d="M60 20L20 100H100L60 20Z"
              fill="white"
            />
            <path
              d="M60 45V65M60 75H60.01"
              stroke="#dc2626"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <h2 className="success-message__title">{copy.title}</h2>
      <p className="success-message__subtitle">{copy.subtitle}</p>
      {submittedEmail && <p className="success-message__email">Sent to: {submittedEmail}</p>}
    </section>
  );
}

export default SuccessMessage;
