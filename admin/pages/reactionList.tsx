import * as React from "react";
import { DataGridPage } from "@contember/admin";
import { GridContent } from "../forms/reactionGrid";

export default (
	<DataGridPage entities="Reaction" rendererProps={{ title: "Přehled reakcí" }}>
		<GridContent />
	</DataGridPage>
);
