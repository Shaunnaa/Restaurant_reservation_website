class NavBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <nav class="navbar flex justify-between items-center w-[92%] mx-auto h-[84px]"> <!--Flex set to row | items-center set to the center of row-->
        <div>
            <img class="w-24" src="../image/Dine_ease_3.png">
        </div>

        <div class="nav-links duration-500 md:static absolute bg-[#BC3535] md:min-h-fit min-h-[60vh] left-0 top-[-100%] mid:w-auto-full flex items-center px-5"> <!--this line use for responsive-->
            <ul class="flex md:flex-row flex-col md:items-center mid:gap-[4vw] gap-12">
                <li>
                    <a class="text-white hover:text-gray-500" href="./">Home</a>
                </li>
                <li class="relative">
                    <a class="text-white hover:text-gray-500" href="#">Restaurant</a>
                    <!-- Dropdown Menu -->
                    <ul class="absolute top-full left-0 bg-[#BC3535] w-32 rounded-lg shadow-md hidden">
                        <li><a class="block px-4 py-2 text-white hover:bg-[#8B1010]" href="./TopPick">Top pick</a></li>
                        <li><a class="block px-4 py-2 text-white hover:bg-[#8B1010]" href="./Close-to-you">Close To You</a></li>
                    </ul>
                </li>
                
                
                <li>
                    <a class="text-white hover:text-gray-500" href="./Category">Category</a>
                </li>
                <li>
                    <a class="text-white hover:text-gray-500" href="./About">About</a>
                </li>
            </ul>
        </div>

        <!--text-3xl = 	font-size: 1.875rem; /* 30px */
                        height: 2.25rem; /* 36px */-->
        <div class="location_icon hidden md:flex items-center gap-6">
            <ion-icon name="location-outline" class="text-3xl"></ion-icon>
        </div>


        <!--Search section-->
        <form class="max-w-lg mx-auto" action="/search-summit" method="post">
            <div class="flex">
                <button id="dropdown-button" class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 
                                                    border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-1 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 
                                                    dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" 
                                             type="button">Advanced Search</button> <!--focus:ring-4 = When click have a border show-->

                <div class="relative w-full">
                    <input type="search" id="search-dropdown" name = "searchdropdown" class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search " required />
                    <button type="submit" class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 
                                                 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 
                                                 dark:focus:ring-blue-800">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                        <span class="sr-only">Search</span>
                    </button>
                </div>
            </div>
        </form>

        <div class="flex items-center gap-6">
            <ion-icon name="notifications" class="text-3xl"></ion-icon>
            <a href="./login" class="bg-white text-black px-5 py-2 rounded-full hover:bg-[#87acec]">Sign Up / Login</a>
            <ion-icon onclick="onToggleMenu(this)" name="menu" class="text-3xl cursor-pointer md:hidden"></ion-icon>
        </div>
    </nav>
        `;
    }
}

customElements.define('navbar-component', NavBar);
// document.addEventListener("DOMContentLoaded", function () {
//     customElements.define('navbar-component', NavBar);
// });

const navLinks = document.querySelector('.nav-links')
const locationIconContainer = document.querySelector('location_icon');

function onToggleMenu(e) {
    console.log(e.name) //.name like to the name of name="menu"
    e.name = (e.name === 'menu' ? 'close' : 'menu') //Change icon from menu to close by use if condition
    navLinks.classList.toggle('top-[10%]')
    locationIconContainer.classList.toggle('visible'); // Toggle visibility of location icon container

}

document.addEventListener("DOMContentLoaded", function () {
    var restaurantLink = document.querySelector('.relative > a'); // Get the "Restaurant" link
    var dropdownMenu = restaurantLink.nextElementSibling; // Get the dropdown menu

    // Function to toggle the dropdown menu
    function toggleDropdown() {
        dropdownMenu.classList.toggle('hidden'); // Toggle the "hidden" class
    }

    // Event listener to toggle the dropdown menu when the link is clicked
    restaurantLink.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the link from being followed
        toggleDropdown(); // Call the toggleDropdown function
    });
});
