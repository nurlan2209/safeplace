package com.safeplace.config;

import org.hibernate.boot.model.FunctionContributions;
import org.hibernate.boot.model.TypeContributions;
import org.hibernate.community.dialect.SQLiteDialect;
import org.hibernate.dialect.function.StandardSQLFunction;
import org.hibernate.type.StandardBasicTypes;

import java.sql.Types;

public class CustomSQLiteDialect extends SQLiteDialect {

    public CustomSQLiteDialect() {
        super();
    }

    @Override
    public boolean supportsIdentityColumns() {
        return true;
    }

    @Override
    public boolean hasDataTypeInIdentityColumn() {
        return false;
    }

    @Override
    public String getIdentityColumnString() {
        return "INTEGER PRIMARY KEY AUTOINCREMENT";
    }

    @Override
    public String getIdentitySelectString() {
        return "SELECT last_insert_rowid()";
    }
}
