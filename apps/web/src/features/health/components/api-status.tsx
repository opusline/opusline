type ApiStatusProps = {
  status: string;
};

export function ApiStatus({ status }: ApiStatusProps) {
  const isHealthy = status === "ok";

  return (
    <p className={isHealthy ? "text-green-600" : "text-red-600"}>
      API status: {status}
    </p>
  );
}
