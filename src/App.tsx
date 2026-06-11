import { Toaster } from "sonner";
import { AppRouter } from "@/router/AppRouter";

function App() {
	return (
		<>
			<AppRouter />
			<Toaster richColors position="top-right" />
		</>
	);
}

export default App;
