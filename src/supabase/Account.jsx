import { useState, useEffect } from "react";
import { supabase } from "./client";
import { CgSpinner, CgProfile } from "react-icons/cg";

const Account = ({ session }) => {
	const [loading, setLoading] = useState(true);
	const [username, setUsername] = useState(null);
	const [website, setWebsite] = useState(null);
	const [avatar_url, setAvatarUrl] = useState(null);

	useEffect(() => {
		getProfile();
	}, [session]);

	const getProfile = async () => {
		try {
			setLoading(true);
			const { user } = session;

			let { data, error, status } = await supabase
				.from("profiles")
				.select(`username, website, avatar_url`)
				.eq("id", user.id)
				.single();

			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setUsername(data.username);
				setWebsite(data.website);
				setAvatarUrl(data.avatar_url);
			}
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateProfile = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			const { user } = session;

			const updates = {
				id: user.id,
				username,
				website,
				avatar_url,
				updated_at: new Date(),
			};

			let { error } = await supabase.from("profiles").upsert(updates);

			if (error) {
				throw error;
			}
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fcc" aria-live="polite">
			{loading 
			? 
			<CgSpinner className="text-5xl animate-spin" /> 
			: 
			(
				<>
				<form onSubmit={updateProfile} className="border rounded-lg md:p-7 p-4">
					<h2 className="text-4xl font-bold text-center pb-3 fc gap-4">
						Profile <CgProfile />
					</h2>
					<div>Email: {session.user.email}</div>
					<div>
						<label htmlFor="username">Name</label>
						<input
							id="username"
							type="text"
							value={username || ""}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="website">Website</label>
						<input
							id="website"
							type="url"
							value={website || ""}
							onChange={(e) => setWebsite(e.target.value)}
						/>
					</div>
					<div>
						<button className="button primary block" disabled={loading}>
							Update profile
						</button>
					</div>
				</form>
				<button
					type="button"
					className="button block"
					onClick={() => supabase.auth.signOut()}
				>
					Sign Out
				</button>
				</>
			)}
		</div>
	);
};

export default Account;
