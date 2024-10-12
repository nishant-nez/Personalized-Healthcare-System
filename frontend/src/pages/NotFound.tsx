import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';


const NotFound = () => {
    return (
        <section className="bg-white min-h-[90vh] flex items-center justify-center">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">404</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">Something's missing.</p>
                    <p className="mb-4 text-lg font-light text-gray-500">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
                    <Link
                        to={'/'}
                    >
                        <Button>
                            Back to Homepage
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default NotFound;