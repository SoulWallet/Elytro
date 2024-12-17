import SessionCard from '../SessionCard';

export default function ActivationDetail() {
  return (
    <div className="flex flex-col gap-y-lg">
      <div className="flex flex-col gap-2xs px-lg py-md rounded-sm bg-light-green">
        <h3 className="elytro-text-small-bold">Why activate?</h3>
        <p className="elytro-text-tiny-body">
          Activation confirms ownership and protects your account on the
          blockchain network.
        </p>
      </div>

      <SessionCard />
    </div>
  );
}
