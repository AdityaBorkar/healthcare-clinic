import { IconBuildingHospital } from "@tabler/icons-react";

export function LoginBrandingPanel() {
	return (
		<div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 lg:flex lg:w-1/2">
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
				<div className="absolute right-0 bottom-0 h-[500px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-white" />
				<div className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-white" />
			</div>
			<div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
				<div className="mb-8 flex items-center gap-3">
					<div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
						<IconBuildingHospital className="h-8 w-8" />
					</div>
					<span className="font-semibold text-2xl tracking-tight">Shaun</span>
				</div>
				<h1 className="mb-4 font-bold text-4xl leading-tight">
					Healthcare Management
					<br />
					Made Simple
				</h1>
				<p className="max-w-md text-lg opacity-80">
					Streamline your hospital operations with our comprehensive healthcare
					management platform.
				</p>
			</div>
		</div>
	);
}
