"use client";

import NavItem from "./NavItem"
import { CodeIcon, GitHubLogoIcon, HomeIcon, LayersIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"
import { Menu } from "./ui/navbar-menu"

const navitems = [
    {
        title: "Home",
        icon: <HomeIcon />,
        href: "/"
    },
    {
        title: "Proof of Work",
        icon: <CodeIcon />,
        href: "/#pow"
    },
    {
        title: "Blogs",
        icon: <LayersIcon />,
        href: "/"
    },
    {
        title: "Github",
        icon: <GitHubLogoIcon />,
        href: "https://github.com/Spandan-Mishra"
    },
    {
        title: "LinkedIn",
        icon: <LinkedInLogoIcon />,
        href: "https://www.linkedin.com/in/spandan-mishra-a584b7302/"
    },
    {
        title: "X",
        icon: <TwitterLogoIcon />,
        href: "https://twitter.com/intent/follow?screen_name=spandev_"
    }
]

const Navbar = () => {

    return (
        <div className="relative w-full flex items-center justify-center">
            <div className="fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 shadow shadow-primary rounded-md">
                <Menu setActive={() => {}}>
                    {navitems.map((item, index) => (
                        <NavItem key={index} title={item.title} icon={item.icon} href={item.href} />
                    ))}
                </Menu>
            </div>
        </div>
    )
}

export default Navbar