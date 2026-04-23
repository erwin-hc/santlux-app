import { PageTitle } from "@/components/title-page";
import { PiggyBank } from "lucide-react";

const Comissao = () => {
  return (
    <div className="container mx-auto">
      <PageTitle label="COMISSÃO" icon={PiggyBank} loading={true} />
    </div>
  );
};

export default Comissao;
