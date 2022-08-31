import React from 'react';
import './output.css';
import profile from './profile.png';

export default function Settings() {
	return (
		<div id="settings" className="flex-1">
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl tracking-tight font-bold text-gray-900">Settings</h1>
				</div>
			</header>
			<main>
				<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
					{/* Replace with your content */}
					<div className=" px-4 py-6 sm:px-0">
						<div className="border-4 border-dashed border-gray-200 rounded-lg h-96" >

							<div className="bg-white shadow overflow-hidden sm:rounded-lg">
								<div className="px-4 py-5 sm:px-6">
									<h3 className="text-lg leading-6 font-medium text-gray-900">Personnal Information</h3>
								</div>
								<div className="border-t border-gray-200">
									<dl>
										<div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
											<dt className="text-sm font-medium text-gray-500">Full name</dt>
											<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Rayane Saboundji</dd>
										</div>
										<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
											<dt className="text-sm font-medium text-gray-500">Login</dt>
											<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Rasaboun</dd>
										</div>
										<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
											<dt className="text-sm font-medium text-gray-500">Surname</dt>
											<dd className="flex justify-between mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
												<input type="text" value="XXXrasaboun" disabled className="w-1/6 border border-slate-300 rounded-md text-sm shadow-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"></input>
												<button type="button" className="inline-flex justify-between items-center text-white bg-emerald-300 hover:bg-blue-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mr-2 mb-2 focus:outline-none">
													<svg className="w-4 h-4 fill-current mr-2" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
													<p>Edit</p>
												</button>												</dd>
										</div>
										<div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
											<dt className="text-sm font-medium text-gray-500">Avatar</dt>
											<dd className="flex mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 justify-between">
												<img
													className="h-10 w-10"
													src={profile}
													alt=""

												/>
												<button type="button" className="inline-flex justify-between items-center text-white bg-emerald-300 hover:bg-blue-900 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 mr-2 mb-2 focus:outline-none">
													<svg className="w-4 h-4 fill-current mr-2" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
													<p>Edit</p>
												</button>

											</dd>
										</div>

									</dl>
								</div>
							</div>

						</div>
					</div>
					{/* /End replace */}
				</div>
			</main>
		</div>
	)
}



