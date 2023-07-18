"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Modal, Label, TextInput, Select, Table } from "flowbite-react";
import axios from "axios";

interface DataItem {
	key: number;
	nama: string;
	poli: string;
	dokter: string;
	noAntrian: number;
	status: string;
}

interface Character {
	id: number;
	name: string;
}

export default function Home() {
	useEffect(() => {
		let data = [];
		for (let i = 1; i <= 40; i++) {
			let obj = {
				key: i,
				nama: ``,
				poli: ``,
				dokter: ``,
				noAntrian: i,
				status: `Tersedia`,
			};

			data.push(obj);
		}

		localStorage.setItem("dataPasien", JSON.stringify(data));
	}, []);

	const [data, setData] = useState<DataItem[]>([]);
	const [terisiCount, setTerisiCount] = useState<number>(0);
	const [sisaAntrian, setSisaAntrian] = useState<number>(0);

	useEffect(() => {
		const storedData = localStorage.getItem("dataPasien");

		if (storedData) {
			const parsedData: DataItem[] = JSON.parse(storedData);
			setData(parsedData);

			// Count the number of items with status "Terisi"
			const count = parsedData.reduce((acc, item) => {
				if (item.status === "Terisi") {
					return acc + 1;
				}
				return acc;
			}, 0);

			setTerisiCount(count);
		}
	}, []);

	useEffect(() => {
		const count = data.reduce((acc, item) => {
			if (item.status === "Terisi") {
				return acc + 1;
			}
			return acc;
		}, 0);

		setTerisiCount(count);
	}, [data]);

	useEffect(() => {
		const sisa = 40 - terisiCount;
		setSisaAntrian(sisa);
	}, [terisiCount]);

	const [openModal, setOpenModal] = useState<string | undefined>();
	const props = { openModal, setOpenModal };

	const [dokterData, setDokterData] = useState<Character[]>([]);

	useEffect(() => {
		axios
			.get("https://rickandmortyapi.com/api/character")
			.then((response) => {
				console.log("dokterData :", response.data);
				setDokterData(response.data.results);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	const dokterDataCount = dokterData.length;

	const [editedData, setEditedData] = useState<DataItem>({
		key: 0,
		nama: "",
		poli: "",
		dokter: "",
		noAntrian: 0,
		status: "",
	});

	const handleEdit = (key: number) => {
		const itemToEdit = data.find((item) => item.key === key);
		if (itemToEdit) {
			setEditedData(itemToEdit);
			props.setOpenModal(key.toString());
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const updatedData = data.map((item) =>
			item.key === editedData.key ? editedData : item
		);

		const updatedDataWithPoliDokter = updatedData.map((item) =>
			item.key === editedData.key
				? {
						...item,
						poli: editedData.poli,
						dokter: editedData.dokter,
						status: "Terisi",
				  }
				: item
		);

		localStorage.setItem(
			"dataPasien",
			JSON.stringify(updatedDataWithPoliDokter)
		);
		setData(updatedDataWithPoliDokter);
		props.setOpenModal(undefined);
	};

	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setEditedData({ ...editedData, nama: e.target.value });
		},
		[editedData]
	);

	return (
		<>
			<section className="bg-white dark:bg-gray-900 h-screen">
				<div className="flex justify-center align-content-center p-10">
					<h2 className="text-3xl font-bold ">
						Digital Healthcare Yakes Telkom
					</h2>
				</div>
				<div className="flex justify-between-center align-content-center px-20">
					<div className=" w-3/5 bg-white shadow-md rounded-md p-4 m-2">
						{/* Card 1 content */}
						<h2 className="text-xl font-bold mb-2">
							Silahkan Pilih Nomor Antrian Anda
						</h2>
						<div
							style={{ display: "flex", alignItems: "center" }}
							className="my-3"
						>
							{/* <hr style={{ flex: 1, borderColor: "gray", margin: "0 1rem" }} /> */}
							<div className="text-gray-700 my-2 italic">Sesi 1</div>
							<hr style={{ flex: 1, borderColor: "gray", margin: "0 1rem" }} />
						</div>

						<div className="grid grid-cols-10 gap-4">
							{data
								.filter((item) => item.key >= 1 && item.key <= 20)
								.map((item) => (
									<Button
										color={
											item.status === "Tersedia"
												? "gray"
												: item.status === "Terisi"
												? "dark"
												: "failure"
										}
										key={item.key}
										onClick={() => handleEdit(item.key)}
										className="w-full"
									>
										{item.noAntrian}
									</Button>
								))}
						</div>

						<div
							style={{ display: "flex", alignItems: "center" }}
							className="my-3"
						>
							{/* <hr style={{ flex: 1, borderColor: "gray", margin: "0 1rem" }} /> */}
							<div className="text-gray-700 my-2 italic">Sesi 2</div>
							<hr style={{ flex: 1, borderColor: "gray", margin: "0 1rem" }} />
						</div>
						<div className="grid grid-cols-10 gap-4">
							{data
								.filter((item) => item.key >= 21 && item.key <= 40)
								.map((item) => (
									<Button
										color={
											item.status === "Tersedia"
												? "gray"
												: item.status === "Terisi"
												? "dark"
												: "failure"
										}
										key={item.key}
										onClick={() => handleEdit(item.key)}
										className="w-full"
									>
										{item.noAntrian}
									</Button>
								))}
						</div>
					</div>
					<div className="w-2/5 bg-white shadow-md rounded-md p-4 m-2">
						{/* Card 2 content */}
						<h2 className="text-xl font-bold mb-2">Data Antrian</h2>
						<Table hoverable>
							<Table.Body className="divide-y">
								<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
									<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
										Jumlah Pasien Terdaftar
									</Table.Cell>
									<Table.Cell>:</Table.Cell>
									<Table.Cell>{terisiCount} Orang</Table.Cell>
								</Table.Row>
								<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
									<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
										<p>Sisa No. Antrian </p>
									</Table.Cell>
									<Table.Cell>:</Table.Cell>
									<Table.Cell>{sisaAntrian} Nomor</Table.Cell>
								</Table.Row>
								<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
									<Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
										Jumlah Dokter Jaga
									</Table.Cell>
									<Table.Cell>:</Table.Cell>
									<Table.Cell>{dokterDataCount} Dokter</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table>

						<div
							style={{ display: "flex", alignItems: "center" }}
							className="my-3"
						>
							{/* <hr style={{ flex: 1, borderColor: "gray", margin: "0 1rem" }} /> */}
							<div className="text-gray-700 my-2 italic">Status Antrian</div>
							<hr style={{ flex: 1, borderColor: "gray", margin: "0 1rem" }} />
						</div>
						<div className="flex items-center">
							<Button color="gray">&nbsp;</Button>
							<div className="align-middle ml-4">Tersedia</div>
						</div>
						<div className="flex items-center mt-4">
							<Button color="dark">&nbsp;</Button>
							<div className="align-middle ml-4">Terisi</div>
						</div>
						{/* <div className="flex items-center mt-4">
							<Button color="failure">&nbsp;</Button>
							<div className="align-middle ml-4">Batal</div>
						</div> */}
					</div>
				</div>

				<Modal
					show={props.openModal === editedData.key.toString()}
					onClose={() => props.setOpenModal(undefined)}
				>
					<form className="flex w-[100%] flex-col" onSubmit={handleSubmit}>
						{props.openModal !== undefined && (
							<>
								<Modal.Header>
									<div className="mt-1">
										Pendaftaran Antrian No. {props.openModal}
									</div>
								</Modal.Header>
								<Modal.Body>
									<div>
										<div className=" block">
											<Label htmlFor="statusAntrian" value="Status Antrian" />
										</div>

										<Button
											color={
												editedData.status === "Tersedia"
													? "gray"
													: editedData.status === "Terisi"
													? "dark"
													: "failure"
											}
											pill
											className="mb-2"
										>
											<p>{editedData.status}</p>
										</Button>
									</div>
									<div>
										<div className="mb-2 block">
											<Label htmlFor="namaPasien" value="Nama Pasien" />
										</div>

										<TextInput
											ref={inputRef}
											id="nama"
											placeholder="Masukan Nama Pasien"
											required
											type="text"
											value={editedData.nama}
											onChange={handleInputChange}
											onFocus={() => inputRef.current?.focus()}
											autoFocus
											disabled={editedData.status === "Terisi"}
										/>
									</div>
									<div className="my-2 block">
										<Label htmlFor="poli" value="Pilih Poli" />
									</div>
									<Select
										id="poli"
										required
										value={editedData.poli}
										onChange={(e) =>
											setEditedData({ ...editedData, poli: e.target.value })
										}
										disabled={editedData.status === "Terisi"}
									>
										<option>Umum</option>
										<option>Gigi</option>
										<option>Jantung</option>
										<option>Dalam</option>
									</Select>
									<div className="my-2 block">
										<Label htmlFor="dokter" value="Pilih Dokter" />
									</div>
									<Select
										id="dokter"
										required
										value={editedData.dokter}
										onChange={(e) =>
											setEditedData({
												...editedData,
												dokter: e.target.value,
											})
										}
										disabled={editedData.status === "Terisi"}
									>
										{dokterData.map((dokter) => (
											<option key={dokter.id}>{dokter.name}</option>
										))}
									</Select>
								</Modal.Body>
								<Modal.Footer>
									<div className="flex justify-items-center gap-4">
										<Button
											type="submit"
											disabled={editedData.status === "Terisi"}
										>
											Daftar
										</Button>
										<Button
											color="gray"
											onClick={() => props.setOpenModal(undefined)}
										>
											Tutup
										</Button>
									</div>
								</Modal.Footer>
							</>
						)}
					</form>
				</Modal>
			</section>
		</>
	);
}
