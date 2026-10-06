'use client'

import Link from 'next/link'
import Image from 'next/image'
import {usePathname} from 'next/navigation'
import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils';

const navItems = [
    { label: "Library ", href: "/" },
    { label: "Add New", href: "/books/new" },
    { label: "Pricing", href: "/subscriptions" },
]

const Navbar = () => {
    const pathName = usePathname();
    const { user } = useUser();

    return (
        <header className="w-full fixed z-50 bg-('--bg-primary')">
            <div className="wrapper navbar-height py-4 flex justify-between items-center">
                <Link href="/" className="flex gap-0.5 items-center">
                    <Image
                        src="/assets/logo.png"
                        alt="Bookified"
                        width={43}
                        height={26}
                        className="shrink-0"
                        style={{ height: 'auto' }}
                    />
                    <span className="logo-text">Bookify</span>
                </Link>

                <nav className="w-fit flex gap-7.5 items-center">
                    {navItems.map(({ label, href }) => {
                        const isActive = pathName === href ||
                        (href !== '/' && pathName.startsWith(href));

                        return (
                            <Link href={href} key={label}
                                className={cn('nav-link-base', 
                                            isActive ? 'nav-link-active' : 
                                            'text-black hover:opacity-70'
                                            )}>
                                {label}
                            </Link>
                        )
                    })}
                    <Show when="signed-out">
                        <SignInButton>
                            <button type="button" className="nav-link-base text-black hover:opacity-70">Sign in</button>
                        </SignInButton>
                        <SignUpButton>
                            <button type="button" className="nav-link-base nav-link-active">Sign up</button>
                        </SignUpButton>
                    </Show>
                    <Show when="signed-in">
                        <UserButton />
                        {(user?.firstName || user?.primaryEmailAddress?.emailAddress) && (
                            <span className="nav-user-name">
                                {user.firstName || user.primaryEmailAddress?.emailAddress}
                            </span>
                        )}
                    </Show>
                </nav>
            </div>
        </header>
    )
}

export default Navbar
