type ApiStatusProps = {
  status: string;
};

export function ApiStatus({ status }: ApiStatusProps) {
  const isHealthy = status === "ok";

  return (
    <p className={isHealthy ? "text-success" : "text-destructive"}>
      API status: {status}
    </p>
  );
}
