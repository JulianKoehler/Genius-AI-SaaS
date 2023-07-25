import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./mobile-sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { hasValidSubscription } from "@/lib/subscription";

type Props = {};

const Navbar = async (props: Props) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await hasValidSubscription();

  return (
    <div className="flex items-center p-4">
      <MobileSidebar
        apiLimitCount={apiLimitCount}
        isPro={isPro}
      />
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
