import authBackground from "/auth-background.jpg";
import bridge from "@/assets/bridge.jpg";

const AuthImage = () => {
    return (
        <div className="hidden bg-background lg:block">
            <img
                src={bridge}
                alt="Background Image"
                className="h-[90vh] lg:h-[91.2vh] w-full object-cover dark:brightness-[0.8] rounded-md"
            />
        </div>
    );
}

export default AuthImage;