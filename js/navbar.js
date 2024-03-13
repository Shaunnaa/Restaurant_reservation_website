class NavBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <nav class="flex justify-between items-center w-[92%] mx-auto h-[84px]"> <!--Flex set to row | items-center set to the center of row-->
                    <div>
                        <img class="w-16" src="./image/Logo.png">
                    </div>

                    <div class="nav-links duration-500 md:static absolute bg-[#BC3535] md:min-h-fit min-h-[60vh] left-0 top-[-100%] mid:w-auto-full flex items-center px-5"> <!--this line use for responsive-->
                        <ul class="flex md:flex-row flex-col md:items-center mid:gap-[4vw] gap-12">
                            <li>
                                <a class="hover:text-gray-500" href="#">Home</a>
                            </li>
                            <li>
                                <a class="hover:text-gray-500" href="#">Restaurant</a>
                            </li>
                            <li>
                                <a class="hover:text-gray-500" href="#">Category</a>
                            </li>
                            <li>
                                <a class="hover:text-gray-500" href="#">About</a>
                            </li>
                        </ul>
                    </div>

                    <div class="flex items-center gap-6">
                        <button class="bg-[#a6c1ee] text-white px-5 py-2 rounded-full hover:bg-[#87acec]">Sign in</button>
                        <ion-icon name="menu" class="text-3xl cursor-pointer md:hidden" onclick="onToggleMenu(this)"></ion-icon>
                    </div>
                </nav>
        `;
    }
}

customElements.define('navbar-component', NavBar);
