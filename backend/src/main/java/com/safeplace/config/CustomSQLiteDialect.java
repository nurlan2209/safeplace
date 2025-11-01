package com.safeplace.config;

import org.hibernate.boot.model.FunctionContributions;
import org.hibernate.community.dialect.SQLiteDialect;
import org.hibernate.dialect.identity.IdentityColumnSupport;
import org.hibernate.dialect.identity.IdentityColumnSupportImpl;
import org.hibernate.type.SqlTypes;
import org.hibernate.type.descriptor.sql.spi.DdlTypeRegistry;

/**
 * Custom SQLite dialect for Hibernate 6 compatibility
 * Provides proper support for IDENTITY columns and data types
 */
public class CustomSQLiteDialect extends SQLiteDialect {

    @Override
    public IdentityColumnSupport getIdentityColumnSupport() {
        return new IdentityColumnSupportImpl() {
            @Override
            public boolean supportsIdentityColumns() {
                return true;
            }

            @Override
            public String getIdentitySelectString(String table, String column, int type) {
                return "select last_insert_rowid()";
            }

            @Override
            public String getIdentityColumnString(int type) {
                return "integer primary key autoincrement";
            }

            @Override
            public boolean hasDataTypeInIdentityColumn() {
                return false;
            }
        };
    }

    @Override
    protected void registerColumnTypes(DdlTypeRegistry ddlTypeRegistry) {
        super.registerColumnTypes(ddlTypeRegistry);
        // Ensure proper mapping of Java types to SQLite types
        ddlTypeRegistry.addDescriptor(SqlTypes.BOOLEAN, "integer");
        ddlTypeRegistry.addDescriptor(SqlTypes.TINYINT, "integer");
        ddlTypeRegistry.addDescriptor(SqlTypes.SMALLINT, "integer");
        ddlTypeRegistry.addDescriptor(SqlTypes.INTEGER, "integer");
        ddlTypeRegistry.addDescriptor(SqlTypes.BIGINT, "integer");
    }

    @Override
    public void initializeFunctionRegistry(FunctionContributions functionContributions) {
        super.initializeFunctionRegistry(functionContributions);
    }
}
