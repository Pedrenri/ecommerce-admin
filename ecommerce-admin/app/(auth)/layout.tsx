export default function Layout({ children } : {children:  React.ReactNode   }) {
    return (
        <div className="flex items-center justify-center h-full py-2">
            {children}
        </div>
    )
}