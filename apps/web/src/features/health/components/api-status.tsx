import { m } from "@/paraglide/messages.js";

type ApiStatusProps = {
  /** The API's own health token, or null when the request never came back. */
  status: string | null;
};

export function ApiStatus({ status }: ApiStatusProps) {
  if (status === null) {
    return <p className="text-destructive">{m.health_api_unreachable()}</p>;
  }

  return (
    <p className={status === "ok" ? "text-success" : "text-destructive"}>
      {m.health_api_status({ status })}
    </p>
  );
}
