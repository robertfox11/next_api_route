'use server'
import Image from 'next/image';
import React from 'react'
import { CiBellOn, CiBookmarkCheck, CiChat1, CiLogout, CiMenuBurger, CiSearch } from 'react-icons/ci';
import { SidebarItem } from './SidebarItem';
import { IoCalendarOutline, IoCheckboxOutline, IoCodeWorking, IoListOutline, IoPerson, IoPersonOutline, IoPlayForwardOutline } from 'react-icons/io5';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { LogoutBotton } from './LogoutBotton';
import { Session } from "next-auth"

const menuItems = [
  {
    icon: <IoCalendarOutline />,
    title: 'Dashboard',
    path: '/dashboard'
  },
  {
    icon: <IoCheckboxOutline />,
    title: 'Rest TODOS',
    path: '/dashboard/rest-todos'
  },
  {
    icon: <IoListOutline />,
    title: 'Server Actions',
    path: '/dashboard/server-accounts'
  },
  {
    icon: <IoCodeWorking />,
    title: 'Cookies',
    path: '/dashboard/cookies'
  },
  {
    icon: <IoPlayForwardOutline />,
    title: 'Products',
    path: '/dashboard/products'
  },
  {
    icon: <IoPersonOutline />,
    title: 'Profile',
    path: '/dashboard/profile'
  },
]
type Props = {
  session: Session | null
}
export const Sidebar = async ({session}: Props) => {

    console.log(session)
    if (!session) {
      redirect('/api/auth/signin');
    }

    const avatarUrl = ( session?.user?.image )
    ? session.user.image
    : 'https://tailus.io/sources/blocks/stats-cards/preview/images/second_user.webp';

    const userName = session?.user?.name ?? 'No Name';
    const userRoles = session?.user?.roles ?? ['client'];
  return (
    <>
      {/* TODO: src/components <Sidebar /> */}

      <aside className="ml-[-100%] fixed z-10 top-0 pb-3 px-6 w-full flex flex-col justify-between h-screen border-r bg-white transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
        <div>
          <div className="-mx-6 px-6 py-4">
            {/* TODO: Next/Link hacia dashboard */}
            <Link href="#" title="home">
              {/* Next/Image */}
              <Image
                className="w-32"
                src="https://oxymor-st.tailus.io/_astro/bars.DEh8rxfi_2hxS64.webp"
                alt="tailus logo"
                width={100}
                height={100}
              />
            </Link>
          </div>

          <div className="mt-8 text-center">
            {/* Next/Image */}
            <Image
              className="m-auto rounded-full object-cover lg:w-28 lg:h-28"
              src={avatarUrl}
              alt="tailus logo"
              width={100}
              height={100}
            />
            <h5 className="hidden mt-4 text-xl font-semibold text-gray-600 lg:block">{userName}</h5>
            <span className="hidden text-gray-400 lg:block">{userRoles.join(',')}</span>
          </div>

          <ul className="space-y-2 tracking-wide mt-8">
            {/* TODO: src/components <SidebarItem /> */}
            {/* Active className: text-white bg-gradient-to-r from-sky-600 to-cyan-400 */}
            {
              menuItems.map(item => (
                <SidebarItem key={item.path} {...item} />
              ))
            }

          </ul>
        </div>

        <div className="px-6 -mx-6 pt-4 flex justify-between items-center border-t">
          <LogoutBotton/>
        </div>
      </aside>
      {/*TODO: Fin del <Sidebar /> */}
    </>
  );
}
