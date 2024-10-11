import authBackground from "/auth-background.jpg";

const AuthImage = () => {
    return (
        <div className="hidden bg-muted lg:block">
            <img
                src={authBackground}
                alt="Background Image"
                className="h-[90vh] lg:h-[91.2vh] w-full object-cover dark:brightness-[0.2] rounded-md"
            />
        </div>
    );
}

export default AuthImage;