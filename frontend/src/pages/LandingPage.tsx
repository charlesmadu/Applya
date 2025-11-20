
const LandingPage = () => {
  return (
    <>
  <header className="fixed w-full">
    <nav className="bg-white border-gray-200 py-2.5 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
        <a href="#" className="flex items-center">
          <img
          
            src="/src/images/applyr-logo.svg"
            className="h-6 mr-3 sm:h-9"
            alt="Applya Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Applya
          </span>
        </a>
        <div className="flex items-center lg:order-2">
          {/* <a href="#" class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Log in</a> */}
          <a
            href="https://themesberg.com/product/tailwind-css/landing-page"
            className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800"
          >
            Sign In
          </a>
          <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="mobile-menu-2"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              className="hidden w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full lg:flex lg:w-auto lg:order-1"
          id="mobile-menu-2"
        >
          <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-white bg-purple-700 rounded lg:bg-transparent lg:text-purple-700 lg:p-0 dark:text-white"
                aria-current="page"
              >
                Home
              </a>
            </li>


            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
              >
                Features
              </a>
            </li>

            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  {/* Start block */}

  <section className="bg-white dark:bg-gray-900 min-h-screen flex items-center">
    <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
      
      <div className="mr-auto place-self-center lg:col-span-7">
        <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">
          Take Control <br />
          of Your Job Search.
        </h1>
        <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
          The smart way to manage your job search. Track applications across platforms, stay on top of interviews and deadlines, and never let an opportunity slip through the cracks.
        </p>
        <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
          <a
            href="https://github.com/charlesmadu"
            className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-gray-900 border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            Try Applyr Now
          </a>
          <a
            href="https://www.figma.com/community/file/1125744163617429490"
            className="inline-flex items-center justify-center w-full px-5 py-3 mb-2 mr-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:w-auto focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            See demo
          </a>
        </div>
      </div>
      <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
        <img src="/public/images/hero.png" alt="hero image" />
      </div>
    </div>
  </section>
  {/* End block */}

<section className="bg-whitepy-10 md:py-14 xl:py-24">
  <div className="container mx-auto px-4">
    <h4 className="text-4xl font-bold text-center mb-10">
      Why Choose Applyr?
    </h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-4">
      
      {/* Card 1 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-purple-700 hover:border-purple-700 transition-all duration-300 group">
        <div className="w-12 h-12 bg-purple-100 group-hover:bg-white rounded-full inline-flex items-center justify-center mb-4 transition-colors duration-300">
          <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h5 className="text-lg text-gray-900 group-hover:text-white font-bold mb-4 transition-colors duration-300">
          Track Every Application
        </h5>
        <p className="text-gray-600 group-hover:text-gray-200 transition-colors duration-300">
          Never lose track of where you've applied. Keep all your job applications organized in one central dashboard with status tracking and notes.
        </p>
      </div>

      {/* Card 2 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-purple-700 hover:border-purple-700 transition-all duration-300 group">
        <div className="w-12 h-12 bg-purple-100 group-hover:bg-white rounded-full inline-flex items-center justify-center mb-4 transition-colors duration-300">
          <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h5 className="text-lg text-gray-900 group-hover:text-white font-bold mb-4 transition-colors duration-300">
          AI-Powered Parsing
        </h5>
        <p className="text-gray-600 group-hover:text-gray-200 transition-colors duration-300">
          Add jobs in seconds, not minutes. Just paste a URL or job description and our AI automatically extracts all the important details for you.
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-purple-700 hover:border-purple-700 transition-all duration-300 group">
        <div className="w-12 h-12 bg-purple-100 group-hover:bg-white rounded-full inline-flex items-center justify-center mb-4 transition-colors duration-300">
          <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h5 className="text-lg text-gray-900 group-hover:text-white font-bold mb-4 transition-colors duration-300">
          Smart Reminders
        </h5>
        <p className="text-gray-600 group-hover:text-gray-200 transition-colors duration-300">
          Never miss a follow-up deadline again. Set reminders for interviews, follow-ups, and important dates to stay on top of your job search.
        </p>
      </div>

      {/* Card 4 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-purple-700 hover:border-purple-700 transition-all duration-300 group">
        <div className="w-12 h-12 bg-purple-100 group-hover:bg-white rounded-full inline-flex items-center justify-center mb-4 transition-colors duration-300">
          <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h5 className="text-lg text-gray-900 group-hover:text-white font-bold mb-4 transition-colors duration-300">
          Visual Pipeline
        </h5>
        <p className="text-gray-600 group-hover:text-gray-200 transition-colors duration-300">
          See your entire job search at a glance. Track applications from submitted to interview to offer with an intuitive visual pipeline.
        </p>
      </div>

      {/* Card 5 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-purple-700 hover:border-purple-700 transition-all duration-300 group">
        <div className="w-12 h-12 bg-purple-100 group-hover:bg-white rounded-full inline-flex items-center justify-center mb-4 transition-colors duration-300">
          <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h5 className="text-lg text-gray-900 group-hover:text-white font-bold mb-4 transition-colors duration-300">
          Powerful Search & Filters
        </h5>
        <p className="text-gray-600 group-hover:text-gray-200 transition-colors duration-300">
          Find any application instantly. Filter by company, location, salary, status, or custom tags to quickly access the information you need.
        </p>
      </div>

      {/* Card 6 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-purple-700 hover:border-purple-700 transition-all duration-300 group">
        <div className="w-12 h-12 bg-purple-100 group-hover:bg-white rounded-full inline-flex items-center justify-center mb-4 transition-colors duration-300">
          <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h5 className="text-lg text-gray-900 group-hover:text-white font-bold mb-4 transition-colors duration-300">
          Private & Secure
        </h5>
        <p className="text-gray-600 group-hover:text-gray-200 transition-colors duration-300">
          Your job search data is yours alone. We use industry-standard encryption and never share your information with anyone.
        </p>
      </div>

    </div>

    <div className="text-center mt-20">
      <a
        href="#"
        className="inline-flex py-3 px-8 text-white bg-purple-700 hover:bg-purple-800 font-bold rounded-lg transition-colors"
      >
        Get Started Free
      </a>
    </div>
  </div>
</section>

  
  {/* Start block */}
<section className="bg-gray-50 dark:bg-gray-900">
  <div className="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6">
    {/* Row */}
    <div className="items-center gap-8 lg:grid lg:grid-cols-5 xl:gap-16">
      
      {/* Left Side - Content */}
      <div className="text-gray-500 sm:text-lg dark:text-gray-400 lg:col-span-2">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Stay Organized, Stay Ahead
        </h2>
        <p className="mb-8 font-light lg:text-xl">
          Applyr brings all your job applications into one organized dashboard. Track statuses, set reminders, and visualize your progress with tools designed specifically for modern job seekers.
        </p>
        
        {/* List */}
        <ul
          role="list"
          className="pt-8 space-y-5 border-t border-gray-200 my-7 dark:border-gray-700"
        >
          <li className="flex space-x-3">
            <svg
              className="flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">
              AI-powered job parsing
            </span>
          </li>
          <li className="flex space-x-3">
            <svg
              className="flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">
              Smart reminders
            </span>
          </li>
          <li className="flex space-x-3">
            <svg
              className="flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">
              Visual application pipeline
            </span>
          </li>
        </ul>
        
        <p className="mb-8 font-light lg:text-xl">
          Stop juggling spreadsheets and start landing offers - Never lose track of an opportunity again.
        </p>
      </div>

      {/* Right Side - Dashboard Image with Border Shadow */}
      <div className="hidden py-3 lg:flex lg:col-span-3">
        <div className="w-full bg-purple-100 rounded-lg p-5">
          <img
            className="w-full rounded-lg shadow-lg"
            src="/public/images/dashboard.jpg"
            alt="Dashboard Image"
          />
        </div>
      </div>

    </div>
  </div>
</section>
  {/* End block */}


  {/* Start block */}

  <footer className="bg-white dark:bg-gray-900">
    <div className="container mx-auto px-4">
      <div className="text-center pt-10 pb-5 border-b border-[rgba(228,219,237,0.06)]">
        <h2 className="text-4xl text-white font-bold mb-5">
          Ready to organize your job search?
        </h2>
        <p className="mb-4 text-white">
          Stop losing track of applications. Start landing interviews. <br />
          Applya helps you stay organized from application to offer.
        </p>
        <a
          href="./index.html"
          className="inline-flex py-2 px-8 text-primary font-bold bg-purple-700 rounded-std mr-2 mt-3"
        >
          Get Started For Free
        </a>
      </div>
      <div className="text-center py-4 border-b border-[rgba(228,219,237,0.06)]">
        <div className="mb-4 md:mb-0">
        <a
          href="#"
          className="flex items-center justify-center mb-5 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            src="/public/images/applyr-logo.svg"
            className="h-6 mr-3 sm:h-9"
            alt="Appylr Logo"
          />
          Appylr
        </a>

        <span className="block text-sm text-center text-gray-500 dark:text-gray-400">
          © Applyr™ - All Rights Reserved. 
        </span>

        </div>
      </div>
    
    </div>
  </footer>


</>

  )
}

export default LandingPage