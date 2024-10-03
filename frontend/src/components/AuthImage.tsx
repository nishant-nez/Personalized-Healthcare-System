import authBackground from "/auth-background.jpg";

const AuthImage = () => {
    return (
        <div className="hidden bg-muted lg:block">
            <img
                src={authBackground}
                alt="Background Image"
                className="lg:max-h-[600px] xl:max-h-[800px] w-full object-cover dark:brightness-[0.2] rounded-md"
            />
        </div>
    );
}

export default AuthImage;