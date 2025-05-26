export default function Footer() {
    return (
        <footer className="border-border bg-background mt-auto border-t py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                    <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} My App. All rights reserved.</p>
                    <div className="flex space-x-6">
                        {['Terms', 'Privacy', 'Contact'].map((label) => (
                            <a key={label} href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
