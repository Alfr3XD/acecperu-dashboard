import { Categoria } from "@prisma/client";

export interface ProductProps {
    id: number;
    Num: number;
    model: string;
    material: string;
    flow: number;
    frequency: number;
    outlet: string;
    speed: number;
    head: number;
    power: number;
    phase: string;
    voltage_triangulo: number;
    voltage_Y: number;
    weight: number;
    insulation_grade: string;
    time: string;
    categoria?: Categoria | null;
    categoriaId?: number | null;
}