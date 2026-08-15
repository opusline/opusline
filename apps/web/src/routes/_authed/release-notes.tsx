import {
  currentUserOptions,
  currentUserQueryKey,
  updateUserReleaseNotesSeenMutation,
} from "@opusline/api-client/react-query";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ReleaseNotesPage } from "@/features/release-notes/components/release-notes-page";
import { APP_VERSION } from "@/lib/version";

export const Route = createFileRoute("/_authed/release-notes")({
  component: ReleaseNotesRoute,
});

function ReleaseNotesRoute() {
  const { data: user } = useSuspenseQuery(currentUserOptions());
  const queryClient = useQueryClient();

  const markSeen = useMutation({
    ...updateUserReleaseNotesSeenMutation(),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(currentUserQueryKey(), updatedUser);
    },
  });

  return (
    <ReleaseNotesPage
      isMarking={markSeen.isPending}
      onMarkRead={() => markSeen.mutate({ body: { version: APP_VERSION } })}
      seenVersion={user.releaseNotesSeenVersion}
    />
  );
}
