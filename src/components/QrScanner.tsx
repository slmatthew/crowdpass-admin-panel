import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export function QrScanner({ onScan }: { onScan: (text: string) => void }) {
	useEffect(() => {
		const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250, rememberLastUsedCamera: true }, false);

		scanner.render(
			(decodedText) => {
				onScan(decodedText);
				scanner.clear();
			},
			(err) => {
				console.error('[qr scanner]', err);
			}
		);

		return () => {
			scanner.clear().catch(() => {});
		};
	}, [onScan]);

	return <div id="reader" className="w-full" />;
}