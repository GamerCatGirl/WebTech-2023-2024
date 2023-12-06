export enum UnitTypes {
    Volume = "Vol",
    Mass = "Mass",
}

export enum MassUnit {
    Kilogram = "kg",
    Gram = "g",
    Milligram = "mg",
    Pound = "[lb_av]",
}

export enum VolumeUnit {
    Liter = "L",
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
