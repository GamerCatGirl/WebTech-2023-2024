export enum UnitType {
    Volume = "Vol",
    Mass = "Mass",
    Custom = "Custom",
}

export enum MassUnit {
    Kilogram = "kg",
    Gram = "g",
    Milligram = "mg",
    Pound = "[lb_av]",
}

export enum VolumeUnit {
    Liter = "L",
    MilliLiter = "mL",
    Centiliter = "cL",
    GallonUS = "[gal_us]",
    GallonBR = "[gal_br]",
    PintUS = "[pt_us]",
    PintBR = "[pt_br]",
    FluidOunceUS = "[foz_us]",
    FluidOunceBR = "[foz_br]",
    TeaspoonUS = "[tsp_us]",
    TeaspoonM = "[tsp_m]",
    TablespoonUS = "[tbs_us]",
    TablespoonM = "[tbs_m]",
}

export const unitNames = {
    [MassUnit.Kilogram]: "kilogram",
    [MassUnit.Gram]: "gram",
    [MassUnit.Milligram]: "milligram",
    [MassUnit.Pound]: "pound",
    [VolumeUnit.Liter]: "liter",
    [VolumeUnit.MilliLiter]: "milliliter",
    [VolumeUnit.Centiliter]: "centiliter",
    [VolumeUnit.GallonUS]: "gallon - US",
    [VolumeUnit.GallonBR]: "gallon - British",
    [VolumeUnit.PintUS]: "pint - US",
    [VolumeUnit.PintBR]: "pint - British",
    [VolumeUnit.FluidOunceUS]: "fluid ounce - US",
    [VolumeUnit.FluidOunceBR]: "fluid ounce - British",
    [VolumeUnit.TablespoonUS]: "tablespoon - US",
    [VolumeUnit.TablespoonM]: "tablespoon - Metric",
    [VolumeUnit.TeaspoonUS]: "teaspoon - US",
    [VolumeUnit.TeaspoonM]: "teaspoon - Metric",
};

export type Unit = VolumeUnit | MassUnit;

const units: { [key: string]: Unit } = {
    ...Object.entries(MassUnit).reduce((map, value) => {
        // @ts-expect-error
        map[value[1].toLowerCase()] = value[1];
        // @ts-expect-error
        map[value[0].toLowerCase()] = value[1];
        return map;
    }, {}),
    ...Object.entries(VolumeUnit).reduce((map, value) => {
        // @ts-expect-error
        map[value[1].toLowerCase()] = value[1];
        // @ts-expect-error
        map[value[0].toLowerCase()] = value[1];
        return map;
    }, {}),
};

export function getUnit(name: string): Unit | undefined {
    return units[name.toLowerCase()];
}

const massUnits = Object.values(MassUnit).map((value) => value.toLowerCase());
const volumeUnits = Object.values(VolumeUnit).map((value) => value.toLowerCase());

export function getUnitType(unit: Unit | undefined): UnitType {
    if (!unit) return UnitType.Custom;

    const lowerUnit = unit.toLowerCase();
    if (massUnits.includes(lowerUnit)) return UnitType.Mass;
    else if (volumeUnits.includes(lowerUnit)) return UnitType.Volume;
    else return UnitType.Custom;
}

export function getUnitByName(name: string): UnitType {
    const unit = getUnit(name);
    return unit ? getUnitType(unit) : UnitType.Custom;
}
