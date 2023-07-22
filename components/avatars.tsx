import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatCompletionResponseMessageRoleEnum } from "openai";

export const UserAvatar = () => {
  const { user } = useUser();

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user?.profileImageUrl} />
      <AvatarFallback>
        {user?.firstName?.charAt(0).toUpperCase()}
        {user?.lastName?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export const BotAvatar = () => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage
        className="p-1"
        src="/logo.png"
      />
    </Avatar>
  );
};

export const avatarMap = {
  [ChatCompletionResponseMessageRoleEnum.User]: <UserAvatar />,
  [ChatCompletionResponseMessageRoleEnum.Assistant]: <BotAvatar />,
  [ChatCompletionResponseMessageRoleEnum.System]: <BotAvatar />,
  [ChatCompletionResponseMessageRoleEnum.Function]: <BotAvatar />,
};
