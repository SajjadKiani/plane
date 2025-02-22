import { useRouter } from "next/router";
import Link from "next/link";

import useSWR from "swr";

// services
import userService from "services/user.service";
// ui
import { Icon, Loader } from "components/ui";
// helpers
import { activityDetails } from "helpers/activity.helper";
import { timeAgo } from "helpers/date-time.helper";
// fetch-keys
import { USER_PROFILE_ACTIVITY } from "constants/fetch-keys";

export const ProfileActivity = () => {
  const router = useRouter();
  const { workspaceSlug, userId } = router.query;

  const { data: userProfileActivity } = useSWR(
    workspaceSlug && userId
      ? USER_PROFILE_ACTIVITY(workspaceSlug.toString(), userId.toString())
      : null,
    workspaceSlug && userId
      ? () => userService.getUserProfileActivity(workspaceSlug.toString(), userId.toString())
      : null
  );

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Recent Activity</h3>
      <div className="border border-custom-border-100 rounded p-6">
        {userProfileActivity ? (
          <div className="space-y-5">
            {userProfileActivity.results.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex-shrink-0">
                  {activity.actor_detail.avatar && activity.actor_detail.avatar !== "" ? (
                    <img
                      src={activity.actor_detail.avatar}
                      alt={activity.actor_detail.first_name}
                      height={24}
                      width={24}
                      className="rounded"
                    />
                  ) : (
                    <div className="grid h-6 w-6 place-items-center rounded border-2 bg-gray-700 text-xs text-white">
                      {activity.actor_detail.first_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="-mt-1 w-4/5 break-words">
                  <p className="text-sm text-custom-text-200">
                    <span className="font-medium text-custom-text-100">
                      {activity.actor_detail.first_name} {activity.actor_detail.last_name}{" "}
                    </span>
                    {activity.field ? (
                      activityDetails[activity.field]?.message(activity as any)
                    ) : (
                      <span>
                        created this{" "}
                        <a
                          href={`/${activity.workspace_detail.slug}/projects/${activity.project}/issues/${activity.issue}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-custom-text-100 inline-flex items-center gap-1 hover:underline"
                        >
                          Issue
                          <Icon iconName="launch" className="!text-xs" />
                        </a>
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-custom-text-200">{timeAgo(activity.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Loader className="space-y-5">
            <Loader.Item height="40px" />
            <Loader.Item height="40px" />
            <Loader.Item height="40px" />
            <Loader.Item height="40px" />
            <Loader.Item height="40px" />
          </Loader>
        )}
      </div>
    </div>
  );
};
