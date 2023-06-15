import { useFormikContext } from "formik";
import { FormField } from "components/form/FormField";
import { ImageSelectInput } from "components/form/inputs/ImageSelectInput";
import { Select } from "components/form/Select";
import { useValues } from "context/ValuesContext";
import { SelectField, Textarea } from "@snailycad/ui";
import { QualificationValueType } from "@snailycad/types";
import { useTranslations } from "use-intl";

export function QualificationFields({ image, setImage }: any) {
  const { values, errors, setFieldValue, handleChange } = useFormikContext<any>();
  const { department } = useValues();
  const t = useTranslations("Values");
  const common = useTranslations("Common");

  const TYPES = [
    { label: t("qualification"), value: QualificationValueType.QUALIFICATION },
    { label: t("award"), value: QualificationValueType.AWARD },
  ];

  return (
    <>
      <SelectField
        errorMessage={errors.qualificationType as string}
        label={common("type")}
        name="qualificationType"
        options={TYPES}
        onSelectionChange={(key) => setFieldValue("qualificationType", key)}
        isClearable={false}
        selectedKey={values.qualificationType}
      />

      <FormField errorMessage={errors.departments as string} label={t("departments")}>
        <Select
          isMulti
          isClearable={false}
          values={department.values.map((v) => ({
            value: v.id,
            label: v.value.value,
          }))}
          name="departments"
          onChange={handleChange}
          value={values.departments}
          closeMenuOnSelect={false}
        />
      </FormField>

      <FormField optional errorMessage={errors.description as string} label={common("description")}>
        <Textarea value={values.description} name="description" onChange={handleChange} />
      </FormField>

      <ImageSelectInput image={image} setImage={setImage} />
    </>
  );
}
