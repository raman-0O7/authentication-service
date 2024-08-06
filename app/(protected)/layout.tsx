import Navbar from "./_component/navbar";

interface ProtectedPageLayoutProps {
  children : React.ReactNode
}
const ProtectedLayout = ({ children } : ProtectedPageLayoutProps ) => {   
  return ( 
    <div className="w-full h-full flex flex-col items-center gap-y-10 justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <Navbar />
      {children}
    </div>
   );
}
 
export default ProtectedLayout;