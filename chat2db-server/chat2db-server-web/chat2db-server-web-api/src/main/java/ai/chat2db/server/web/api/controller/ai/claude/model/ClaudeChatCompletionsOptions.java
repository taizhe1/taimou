// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Code generated by Microsoft (R) AutoRest Code Generator.
package ai.chat2db.server.web.api.controller.ai.claude.model;

import lombok.Data;

@Data
public final class ClaudeChatCompletionsOptions {

    private Boolean incremental = true;

    private String model = "claude-2";

    private String prompt;

    private String timezone = "Asia/Shanghai";

    private Boolean stream = true;

    public Boolean isStream() {
        return this.stream;
    }

    public ClaudeChatCompletionsOptions setStream(Boolean stream) {
        this.stream = stream;
        return this;
    }

    public String getModel() {
        return this.model;
    }

    public ClaudeChatCompletionsOptions setModel(String model) {
        this.model = model;
        return this;
    }
}
