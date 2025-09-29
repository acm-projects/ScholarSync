import Link from 'next/link';
import './Navbar.css';

const Navbar = () =>{
    return (
        <div className = "Navbar">

        <div className = "Logo">
            ScholarSync
        </div>
            <div>
            <Link href = "/Home" className = "homeLink">
            Home
            
            </Link>
            </div>

            <div>
            <Link href = "/Create"  className = "createLink">
            Create
            </Link>
            </div>

            <div>
            <Link href = "/Discover"  className = "discoverLink">    
            Discover
            </Link>
            </div>

            <div>
            <Link href = "/Library" className = "libraryLink">
            Library
            </Link>
            </div>

            <div className= "profileClass">
            <button className = "profile">
            Profile
            </button>
            </div>




        </div>



    )


    // Bootstrapped elements
}

export default Navbar;