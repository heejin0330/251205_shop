import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { CartIcon } from "@/components/cart/cart-icon";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
      <Link href="/" className="text-2xl font-bold">
        쇼핑몰
      </Link>
      <nav className="flex gap-6 items-center">
        <Link
          href="/products"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          상품 목록
        </Link>
        <div className="flex gap-4 items-center">
          <SignedIn>
            <CartIcon />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>로그인</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
