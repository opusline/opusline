type LoginFormProps = {
  onSubmit: (values: { email: string; password: string }) => void;
  isPending?: boolean;
  error?: string | null;
};

export function LoginForm({ onSubmit, isPending, error }: LoginFormProps) {
  return (
    <form
      className="mx-auto mt-16 flex w-full max-w-sm flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        onSubmit({
          email: String(data.get("email") ?? ""),
          password: String(data.get("password") ?? ""),
        });
      }}
    >
      <h1 className="font-bold text-2xl">Log in</h1>
      {error ? (
        <p className="text-red-600 text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          className="rounded border px-3 py-2"
          name="email"
          required
          type="email"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Password
        <input
          className="rounded border px-3 py-2"
          name="password"
          required
          type="password"
        />
      </label>
      <button
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        disabled={isPending}
        type="submit"
      >
        Log in
      </button>
    </form>
  );
}
