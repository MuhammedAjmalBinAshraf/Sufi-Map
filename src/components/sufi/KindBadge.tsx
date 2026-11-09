import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import type { SiteKind } from "@/lib/sites";

export function KindBadge({ kind }: { kind: SiteKind }) {
  const { t } = useI18n();
  return (
    <Badge variant="parchment" className="font-medium">
      {t(`kind.${kind}`)}
    </Badge>
  );
}
