import { useMemo, useRef, useState } from "react";
import LeftMenu from "../components/LeftMenu";
import TextInputField from "../components/TextInputField";
import StepsPanel from "../components/StepsPanel";
import FileDropzone from "../components/FileDropzone";
import "./form.css";

export default function Form() {
	const [workspaceName, setWorkspaceName] = useState("");
	const [ownerName, setOwnerName] = useState("");
	const [accepted, setAccepted] = useState(true);
	const [files, setFiles] = useState<File[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	const selectedFilesLabel = useMemo(() => {
		if (files.length === 0) {
			return "No files selected";
		}

		if (files.length === 1) {
			return `1 file selected: ${files[0].name}`;
		}

		return `${files.length} files selected`;
	}, [files]);

	const appendFiles = (incomingFiles: FileList | null) => {
		if (!incomingFiles || incomingFiles.length === 0) {
			return;
		}

		const uniqueByNameAndSize = new Map<string, File>();

		[...files, ...Array.from(incomingFiles)].forEach((file) => {
			uniqueByNameAndSize.set(`${file.name}-${file.size}`, file);
		});

		setFiles(Array.from(uniqueByNameAndSize.values()));
	};

	return (
		<main className="workspace-page">
			<section className="workspace-shell">
				<LeftMenu />

				<section className="workspace-content">
					<div className="workspace-header-row">
						<div>
							<h1 className="workspace-title">Create a New Workspace</h1>
							<p className="workspace-subtitle">
								Set up your workspace information and upload the required documentation to continue.
							</p>
						</div>
						<StepsPanel />
					</div>

					<div className="workspace-inputs">
						<TextInputField
							id="workspace-name"
							label="Workspace name"
							value={workspaceName}
							placeholder="Acme Growth Dashboard"
							onChange={setWorkspaceName}
						/>
						<TextInputField
							id="owner-name"
							label="Project owner"
							value={ownerName}
							placeholder="Enter full name"
							onChange={setOwnerName}
						/>
					</div>

					<section className="workspace-upload-section">
						<h2>Supporting documents</h2>
						<p>
							Upload relevant files such as contracts, screenshots, reports, or supporting documentation.
						</p>

						<input
							ref={inputRef}
							className="file-input-hidden"
							type="file"
							multiple
							onChange={(event) => appendFiles(event.target.files)}
						/>

						<FileDropzone
							onBrowse={() => inputRef.current?.click()}
							onDropFiles={appendFiles}
						/>

						<p className="selected-files-label">{selectedFilesLabel}</p>

						<label className="workspace-checkbox-row" htmlFor="confirmation-check">
							<input
								id="confirmation-check"
								type="checkbox"
								checked={accepted}
								onChange={(event) => setAccepted(event.target.checked)}
							/>
							<span>I confirm that the information provided is accurate and complete.</span>
						</label>

						<div className="workspace-actions">
							<button className="ghost-btn" type="button">
								Save as draft
							</button>
							<button className="primary-btn" type="button" disabled={!accepted}>
								Continue
							</button>
						</div>
					</section>
				</section>
			</section>
		</main>
	);
}
