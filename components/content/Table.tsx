'use client';
import {
    useState,
    useMemo,
    useCallback,
    MouseEvent,
    Key,
    useEffect,
    JSX
} from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
    SortDescriptor,
    Spinner,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Select,
    SelectItem,
    Selection
} from "@nextui-org/react";
import { MdDelete, MdEdit, MdSearch } from "react-icons/md";
import { BiChevronDown, BiPlus } from "react-icons/bi";
import Link from "next/link";
import { MagicMotion } from "react-magic-motion";

const defaultColumns = (columns: { name: string; uid: string; sortable?: boolean }[]) => {
    return [...columns, {uid: "actions", name: "ACCIONES"}]
}

interface TableComponentProps {
    columns: { name: string; uid: string; sortable?: boolean }[];
    data: any[];
    serchColumnFilter?: string;
    callbackEditButton?: (item: any) => string;
    callbackAddButton?: string;
    callbackDeleteButton?: (e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void,
    callbackDeleteButtonColumn?: (key: any) => void,
    selectedColumnsKey?: (selected: any[]) => void;
    keyTarget?: string;
    customCellsRender?: {
        [key: string]: (cellValue: string) => (JSX.Element)
    };
    disabledKeys?: string[];
    disabledEditKeys?: string[];
    emptyBody?: string;
    searchPlaceholder?: string;
    isLoading?: boolean;
    filterColumn?: {
        column: {
            uid: string;
            name: string;
        },
        options: {name: string, uid: string}[];
    };
}

function TableComponent({
    columns,
    data,
    serchColumnFilter,
    callbackEditButton,
    callbackAddButton,
    callbackDeleteButton,
    callbackDeleteButtonColumn,
    selectedColumnsKey,
    keyTarget,
    customCellsRender,
    disabledKeys,
    emptyBody,
    searchPlaceholder,
    filterColumn,
    disabledEditKeys,
}: TableComponentProps) {
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<'all' | Set<Key>>(new Set([]));
    const [columnFilter, setColumnFilter] = useState<'all' | Set<Key>>("all");
    const [visibleColumns, setVisibleColumns] = useState<'all' | Set<Key>>(new Set(defaultColumns(columns).map((x) => x.uid)));
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState<any>({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        return defaultColumns(columns).filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns, columns]);

    const filteredItems = useMemo(() => {
        let filteredData = [...data];

        if (hasSearchFilter && serchColumnFilter) {
            filteredData = filteredData.filter((item) =>
                item[serchColumnFilter]? item[serchColumnFilter].toLowerCase().includes(filterValue.toLowerCase()) : item
            );
        }

        if(filterColumn) { 
            if(columnFilter !== "all" && Array.from(columnFilter).length !== filterColumn.options.length) {
                filteredData = filteredData.filter((filter) => {
                    return Array.from(columnFilter).includes(filter[filterColumn.column.uid])
                })
            }
        }
        return filteredData;
    }, [data, hasSearchFilter, serchColumnFilter, filterColumn, filterValue, columnFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column as keyof typeof a];
            const second = b[sortDescriptor.column as keyof typeof b];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = useCallback((item: any, columnKey: string, isEditDisabled?: boolean, isDisabledKey?: boolean) => {
        const cellValue = item[columnKey as keyof typeof item];
        const columnRenderers: Record<string, (value: string) => JSX.Element> = {
            actions: () => (
                <div className="flex justify-end items-center gap-2 w-fit">
                    <Link className={isEditDisabled ? "!pointer-events-none !cursor-not-allowed" : "hover:scale-110 transform"} href={callbackEditButton ? callbackEditButton(item) : "#"}>
                        
                        <Button className="text-amber-600 bg-transparent" radius="full" isIconOnly isDisabled={isEditDisabled}>
                            <MdEdit className="w-6 h-6" />
                        </Button>
        
                    </Link>
                    
                    <Button
                        className={(isDisabledKey ? "!cursor-not-allowed" : "") + " text-red-600 bg-transparent hover:scale-110 transform"}
                        onClick={() => callbackDeleteButtonColumn ? callbackDeleteButtonColumn(item[keyTarget ? keyTarget : "id"]) : {}}
                        radius="full"
                        isIconOnly
                        isDisabled={isDisabledKey}
                    >
                        <MdDelete className="w-6 h-6" />
                    </Button>
                </div>
            ),
            ...customCellsRender
        };

        if (columnRenderers[columnKey]) {
            return columnRenderers[columnKey](cellValue);
        } else {
            return cellValue;
        }
        
    }, [callbackDeleteButtonColumn, callbackEditButton, customCellsRender, keyTarget]);

    const onNextPage = useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
        }, []
    );

    const onSearchChange = useCallback((value: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);
    
    const topContent = useMemo(() => {
        const isDisabledKey = () => !(
            selectedKeys === "all" ?
            sortedItems.filter(item => disabledKeys?.includes(String(item[keyTarget ? keyTarget : "id"])) === false).length > 0
            :
            sortedItems.filter(item =>
                Array.from(selectedKeys as Set<string>)
                .includes(String(item[keyTarget ? keyTarget : "id"])) && 
                !disabledKeys?.includes(String(item[keyTarget ? keyTarget : "id"]))
            ).length > 0
        );

        return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-between gap-3 items-end">
                <div className="w-full sm:max-w-[48%] flex flex-col lg:flex-row lg:items-center gap-3">
                    <Input
                        isClearable
                        className=""
                        classNames={{
                            inputWrapper: "bg-white border border-black/10"
                        }}
                        placeholder={searchPlaceholder? searchPlaceholder : "Buscar..."}
                        startContent={<MdSearch />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    {
                        filterColumn?.column.name ? 
                        <Dropdown>
                            <DropdownTrigger className="bg-white border border-black/10 hover:bg-slate-100">
                                <Button
                                    endContent={<BiChevronDown className="text-small" />}
                                    variant="flat"
                                >
                                    {filterColumn.column.name}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Row Columns Filter"
                                closeOnSelect={false}
                                selectedKeys={columnFilter}
                                selectionMode="multiple"
                                onSelectionChange={setColumnFilter}
                            >
                                {filterColumn.options.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {column.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        :
                        <></>
                    }

                    <Dropdown>
                        <DropdownTrigger className="bg-white border border-black/10 hover:bg-slate-100">
                            <Button
                                endContent={<BiChevronDown className="text-small" />}
                                variant="flat"
                            >
                                Columnas
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={visibleColumns}
                            selectionMode="multiple"
                            onSelectionChange={setVisibleColumns}
                        >
                            {defaultColumns(columns).map((column) => (
                                <DropdownItem key={column.uid} className="capitalize">
                                    {column.uid}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>

                    <Link href={callbackAddButton ? callbackAddButton : "#"}>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            startContent={<BiPlus />}
                        >
                            Añadir
                        </Button>
                    </Link>
                    <Button
                        onPress={onOpen}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        startContent={<MdDelete />}
                        isDisabled={isDisabledKey()}
                    >
                        Eliminar seleccionados
                    </Button>
                </div>
            </div>
            <div className="flex flex-wrap gap-5 justify-center sm:justify-between items-center">
                <span className="text-default-400 text-small">
                    Total: {data.length}
                </span>
                <label className="flex items-center text-default-400 text-small">
                    Columnas por página:
                    <select
                        defaultValue="10"
                        className="bg-transparent outline-none text-default-400 text-small"
                        onChange={onRowsPerPageChange}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </div>
        </div>
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchPlaceholder, filterValue, onSearchChange, columnFilter, visibleColumns, columns, callbackAddButton, onOpen, selectedKeys, sortedItems, data.length, onRowsPerPageChange, onClear, disabledKeys, keyTarget]);

    const bottomContent = useMemo(() => {
        return (
        <div className="py-2 px-2 flex flex-wrap gap-4 justify-between items-center">
            <span className="w-[30%] text-small text-default-400">
                {selectedKeys === "all"
                    ? "Todos los items seleccionados"
                    : `seleccionados ${(selectedKeys as Set<any>).size} de ${filteredItems.length}`
                }
            </span>
            <Pagination
                isCompact
                showControls={false}
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={setPage}
            />
            <div className="flex justify-end gap-2">
                <Button
                    isDisabled={pages === 1}
                    size="sm"
                    variant="flat"
                    onPress={onPreviousPage}
                >
                    Anterior
                </Button>
                <Button
                    isDisabled={pages === 1}
                    size="sm"
                    variant="flat"
                    onPress={onNextPage}
                >
                    Siguiente
                </Button>
            </div>
        </div>
        );
    }, [
        selectedKeys,
        filteredItems.length,
        page,
        pages,
        onPreviousPage,
        onNextPage,
    ]);

    useEffect(() => {
        if (selectedColumnsKey) {
          if (selectedKeys === "all") {
            const filteredItems = sortedItems.filter(item => disabledKeys?.includes(String(item[keyTarget ? keyTarget : "id"])) === false);
            selectedColumnsKey(filteredItems);
          } else {
            const selected = Array.from(selectedKeys as Set<string>);
            const filteredItems = sortedItems.filter(item =>
              selected.includes(String(item[keyTarget ? keyTarget : "id"])) && !disabledKeys?.includes(String(item[keyTarget ? keyTarget : "id"]))
            );
            selectedColumnsKey(filteredItems);
          }
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [selectedColumnsKey, selectedKeys, keyTarget]);

    return (
    <>
        <Modal 
            backdrop="opaque" 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            classNames={{
            backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">
                        ⚠️ Advertencia
                    </ModalHeader>
                    <ModalBody>
                        <p> 
                            Si borras toda esta selección, no podrás recuperar los elementos seleccionados
                        </p>
                        <p>
                            ¿Estás seguro de eliminar los seleccionados?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" variant="light" onPress={onClose}>
                            Volver
                        </Button>
                        <Button color="danger" onPress={onClose} onClick={callbackDeleteButton}>
                            Si, Elimnar
                        </Button>
                    </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
        
        <Table
            aria-label="Table component"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor as SortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={(setSelectedKeys)}
            onSortChange={setSortDescriptor}
            classNames={{
                tr: ["rows-color",],
                th: "py-4 bg-neutral-700 text-white",
                td: [
                    "group-data-[first=true]:first:before:rounded-none",
                    "group-data-[first=true]:last:before:rounded-none",
                    "group-data-[middle=true]:before:rounded-none",
                    "group-data-[last=true]:first:before:rounded-none",
                    "group-data-[last=true]:last:before:rounded-none",
                    "group-data-[disabled=true]:bg-transparent",
                    "group-data-[disabled=true]:text-black",
                    "group-data-[disabled=true]:opacity-60",
                ],
            }}
            disabledKeys={disabledKeys}
            color="primary"
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn className="font-bold"
                        key={column.uid}
                        align={"center"}
                        width={column.uid === "actions" ? 100 : 0}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={emptyBody? emptyBody : "No hay contenido"}
                items={sortedItems}
                loadingContent={<Spinner />}
            >
                {(item) => (
                    <TableRow key={(item[keyTarget ? keyTarget : "id"])}>
                        {(columnKey) =>
                            <TableCell>
                                {renderCell(
                                    item, 
                                    columnKey.toString(), 
                                    disabledEditKeys?.includes(String(item[keyTarget ? keyTarget : "id"])), 
                                    disabledKeys?.includes(String(item[keyTarget ? keyTarget : "id"]))
                                )}
                            </TableCell>
                        }
                    </TableRow>
                )}
            </TableBody>
        </Table>
        </>
    )
}

export default TableComponent;
