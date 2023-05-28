import * as React from "react";
import { CadFeatureOptions, Feature, LicenseExamType } from "@snailycad/types";
import { useAuth } from "context/AuthContext";

export const DEFAULT_DISABLED_FEATURES = {
  CUSTOM_TEXTFIELD_VALUES: { isEnabled: false },
  DISCORD_AUTH: { isEnabled: false },
  DMV: { isEnabled: false },
  USER_API_TOKENS: { isEnabled: false },
  CITIZEN_RECORD_APPROVAL: { isEnabled: false },
  COMMON_CITIZEN_CARDS: { isEnabled: false },
  STEAM_OAUTH: { isEnabled: false },
  CREATE_USER_CITIZEN_LEO: { isEnabled: false },
  ACTIVE_WARRANTS: { isEnabled: false },
  CITIZEN_DELETE_ON_DEAD: { isEnabled: false },
  WARRANT_STATUS_APPROVAL: { isEnabled: false },
  LICENSE_EXAMS: { isEnabled: false },
  CITIZEN_CREATION_RECORDS: { isEnabled: false },
  BUREAU_OF_FIREARMS: { isEnabled: false },
  CALL_911_APPROVAL: { isEnabled: false },
  FORCE_DISCORD_AUTH: { isEnabled: false },
  FORCE_STEAM_AUTH: { isEnabled: false },
  SIGNAL_100_CITIZEN: { isEnabled: false },
  FORCE_ACCOUNT_PASSWORD: { isEnabled: false },
  USER_DEFINED_CALLSIGN_COMBINED_UNIT: { isEnabled: false },
} satisfies Partial<Record<Feature, { isEnabled: boolean }>>;

export function useFeatureEnabled(
  features?: Record<Feature, boolean> & { options?: CadFeatureOptions },
) {
  const { cad } = useAuth();
  const _features = features ?? cad?.features;

  const options = React.useMemo(() => {
    const obj = {} as Partial<Record<Feature, any>>;

    const cadFeatures = _features?.options;

    for (const key in cadFeatures) {
      let option = cadFeatures[key as keyof typeof cadFeatures];

      if (key === Feature.LICENSE_EXAMS && Array.isArray(option)) {
        if (option.length === 0) {
          option = Object.values(LicenseExamType);
        }
      }

      obj[key as Feature] = option;
    }

    return obj;
  }, [_features]);

  const featuresObj = React.useMemo(() => {
    const obj: Record<Feature, boolean> = {} as Record<Feature, boolean>;

    Object.keys(Feature).map((feature) => {
      const cadFeature = _features?.[feature as Feature];

      // @ts-expect-error - this is fine
      const isEnabled = cadFeature ?? DEFAULT_DISABLED_FEATURES[feature]?.isEnabled ?? true;

      obj[feature as Feature] = isEnabled;
    });

    return obj;
  }, [_features]);

  return { ...featuresObj, options };
}
