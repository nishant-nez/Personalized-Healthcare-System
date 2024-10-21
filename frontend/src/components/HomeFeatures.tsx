const HomeFeatures = () => {
    return (
        <section className="w-full py-18 md:py-18 lg:py-24 bg-gray-100 bottom-0">
            <div className="container px-4 md:px-6">
                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                        <div className="p-3 bg-black bg-opacity-50 rounded-full">
                            <svg
                                className=" text-white h-6 w-6 opacity-75"
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold">Accurate Predictions</h3>
                        <p className="text-sm text-gray-500 text-center">
                            AI-powered system provides highly accurate disease predictions.
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                        <div className="p-3 bg-black bg-opacity-50 rounded-full">
                            <svg
                                className=" text-white h-6 w-6 opacity-75"
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold">Secure & Private</h3>
                        <p className="text-sm text-gray-500 text-center">
                            Your health data is encrypted and protected with the highest security standards.
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                        <div className="p-3 bg-black bg-opacity-50 rounded-full">
                            <svg
                                className=" text-white h-6 w-6 opacity-75"
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold">Instant Results</h3>
                        <p className="text-sm text-gray-500 text-center">
                            Get disease predictions and medical insights in seconds.
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                        <div className="p-3 bg-black bg-opacity-50 rounded-full">
                            <svg
                                className="text-white h-6 w-6 opacity-75"
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M22 22v-6h-6v6h6z" />
                                <path d="M22 10v-2h-6v6h6v-2" />
                                <path d="M6 22V10H2v12h4z" />
                                <path d="M18 2H6v20h12" />
                                <path d="M18 14h4" />
                                <path d="M18 6h4" />
                                <path d="M10 6v4" />
                                <path d="M8 8h4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold">Hospital Recommendation</h3>
                        <p className="text-sm text-gray-500 text-center">
                            Get location, distance and travel time for the Hospital nearest to your location.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeFeatures;