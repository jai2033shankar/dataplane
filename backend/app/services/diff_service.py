from typing import List, Dict, Any

class DiffService:
    @staticmethod
    def compare_tables(source_cols: List[Dict[str, Any]], target_cols: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Compares columns of two tables and returns structural diff.
        """
        source_map = {c["name"]: c for c in source_cols}
        target_map = {c["name"]: c for c in target_cols}

        matched = []
        missing_in_target = []
        missing_in_source = []
        type_mismatches = []

        # Check source against target
        for name, col in source_map.items():
            if name in target_map:
                target_col = target_map[name]
                matched.append(name)
                # Check Type
                if col["type"].lower() != target_col["type"].lower():
                    type_mismatches.append({
                        "column": name,
                        "source_type": col["type"],
                        "target_type": target_col["type"]
                    })
            else:
                missing_in_target.append(name)

        # Check target against source
        for name in target_map.keys():
            if name not in source_map:
                missing_in_source.append(name)

        return {
            "matched": matched,
            "missing_in_target": missing_in_target,
            "missing_in_source": missing_in_source,
            "type_mismatches": type_mismatches,
            "score": len(matched) / max(1, len(source_map)) * 100
        }

    @staticmethod
    def compare_schemas(source_schema: Dict[str, List[Dict[str, Any]]], target_schema: Dict[str, List[Dict[str, Any]]]) -> Dict[str, Any]:
        """
        Compares entire schemas and finds exact table matches and structural diffs.
        """
        source_tables = set(source_schema.keys())
        target_tables = set(target_schema.keys())

        matched_tables = source_tables.intersection(target_tables)
        missing_tables_in_target = list(source_tables - target_tables)
        missing_tables_in_source = list(target_tables - source_tables)

        table_diffs = {}
        for table in matched_tables:
            table_diffs[table] = DiffService.compare_tables(source_schema[table], target_schema[table])

        return {
            "matched_tables": list(matched_tables),
            "missing_tables_in_target": missing_tables_in_target,
            "missing_tables_in_source": missing_tables_in_source,
            "table_diffs": table_diffs
        }
