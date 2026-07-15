document.addEventListener('DOMContentLoaded', () => {
    // Drawer Elements
    const openBtn = document.getElementById('openAdvancedFilter');
    const closeBtn = document.getElementById('closeAdvancedFilter');
    const drawer = document.getElementById('advancedDrawer');
    const overlay = document.getElementById('overlay');
    const btnApply = document.getElementById('btnApply');
    const btnClearDrawer = document.getElementById('btnClearDrawer');

    // Filter Controls (Dynamic custom select instances)
    const dropdownStatus = document.getElementById('dropdownStatus');
    const dropdownLevel = document.getElementById('dropdownLevel');
    const dropdownVip = document.getElementById('dropdownVip');
    const dropdownOther = document.getElementById('dropdownOther');
    const inputAccount = document.getElementById('inputAccount');

    // Account Type Dropdown Controls
    const accountTypeSelected = document.getElementById('accountTypeSelected');
    const accountTypeMenu = document.getElementById('accountTypeMenu');
    const accountTypeText = document.getElementById('accountTypeText');
    let currentAccountType = 'exact'; // Default type: exact

    // Toggle Account Type Dropdown
    accountTypeSelected.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllDropdowns();
        accountTypeMenu.classList.toggle('show');
    });

    // Handle account type selection
    accountTypeMenu.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', (e) => {
            accountTypeMenu.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            
            const value = item.getAttribute('data-value');
            currentAccountType = value;
            
            const selectedText = item.querySelector('span').textContent;
            accountTypeText.textContent = selectedText;

            // Change placeholder and clear value
            if (value === 'exact') {
                inputAccount.placeholder = '請輸入精確帳號';
            } else if (value === 'fuzzy') {
                inputAccount.placeholder = '請輸入模糊帳號關鍵字';
            } else if (value === 'multi') {
                inputAccount.placeholder = "帐号以';'隔开，上限限制 50 个帐号";
            } else {
                inputAccount.placeholder = `請輸入${selectedText}`;
            }
            inputAccount.value = '';
            
            accountTypeMenu.classList.remove('show');
            updateFilters();
            renderTable();
        });
    });

    // Helper: Close all dropdown menus
    function closeAllDropdowns() {
        document.querySelectorAll('.select-options').forEach(el => el.classList.remove('show'));
        accountTypeMenu.classList.remove('show');
        const colToggle = document.getElementById('columnToggleDropdown');
        if (colToggle) colToggle.classList.remove('show');
        const batchMenu = document.getElementById('batchOperationsMenu');
        if (batchMenu) batchMenu.classList.remove('show');
        const exportMenu = document.getElementById('exportDataMenu');
        if (exportMenu) exportMenu.classList.remove('show');
        const basicFieldsDropdown = document.getElementById('basicFieldsDropdown');
        if (basicFieldsDropdown) basicFieldsDropdown.style.display = 'none';
    }

    // Close Dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select-single') && 
            !e.target.closest('.custom-select-multi') && 
            !e.target.closest('.account-type-dropdown') &&
            !e.target.closest('.column-toggle-container') &&
            !e.target.closest('.batch-dropdown-container') &&
            !e.target.closest('.export-dropdown-container') &&
            !e.target.closest('.basic-fields-toggle-container')) {
            closeAllDropdowns();
        }
    });

    // Basic Fields Dropdown Toggler
    const btnFilterFieldsToggle = document.getElementById('btnFilterFieldsToggle');
    const basicFieldsDropdown = document.getElementById('basicFieldsDropdown');
    if (btnFilterFieldsToggle && basicFieldsDropdown) {
        btnFilterFieldsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = basicFieldsDropdown.style.display === 'block';
            closeAllDropdowns();
            if (!isOpen) {
                basicFieldsDropdown.style.display = 'block';
            }
        });

        basicFieldsDropdown.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const fieldName = e.target.getAttribute('data-field');
                const fieldElement = document.querySelector(`#filterRow [data-field="${fieldName}"]`);
                if (fieldElement) {
                    fieldElement.style.display = e.target.checked ? '' : 'none';
                }
            });
        });
    }

    // Batch Operations Dropdown Toggler
    const btnBatchOperations = document.getElementById('btnBatchOperations');
    const batchOperationsMenu = document.getElementById('batchOperationsMenu');
    if (btnBatchOperations && batchOperationsMenu) {
        btnBatchOperations.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = batchOperationsMenu.classList.contains('show');
            closeAllDropdowns();
            if (!isOpen) {
                batchOperationsMenu.classList.add('show');
            }
        });

        batchOperationsMenu.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                alert(`觸發操作：${li.textContent.trim()}`);
                batchOperationsMenu.classList.remove('show');
            });
        });
    }

    // Export Data Dropdown Toggler
    const btnExportData = document.getElementById('btnExportData');
    const exportDataMenu = document.getElementById('exportDataMenu');
    if (btnExportData && exportDataMenu) {
        btnExportData.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = exportDataMenu.classList.contains('show');
            closeAllDropdowns();
            if (!isOpen) {
                exportDataMenu.classList.add('show');
            }
        });

        exportDataMenu.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                alert(`觸發操作：${li.textContent.trim()}`);
                exportDataMenu.classList.remove('show');
            });
        });
    }

    // Custom Dropdown single-select initializer
    function initSingleSelect(element, onChange) {
        const selected = element.querySelector('.select-selected');
        const selectedValSpan = element.querySelector('.selected-val');
        const optionsList = element.querySelector('.select-options');
        
        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = optionsList.classList.contains('show');
            closeAllDropdowns();
            if (!isOpen) {
                optionsList.classList.add('show');
            }
        });

        optionsList.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                optionsList.querySelectorAll('li').forEach(l => l.classList.remove('active'));
                li.classList.add('active');
                selectedValSpan.textContent = li.textContent.trim();
                optionsList.classList.remove('show');
                if (onChange) onChange(li.getAttribute('data-value'));
            });
        });
    }

    // Custom Dropdown multi-select initializer
    function initMultiSelect(element, onChange) {
        const selected = element.querySelector('.select-selected');
        const selectedValSpan = element.querySelector('.selected-val');
        const optionsList = element.querySelector('.select-options');

        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = optionsList.classList.contains('show');
            closeAllDropdowns();
            if (!isOpen) {
                optionsList.classList.add('show');
            }
        });

        optionsList.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                const checkbox = li.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                li.classList.toggle('selected', checkbox.checked);
                
                updateDisplay();
                if (onChange) onChange();
            });
        });

        function updateDisplay() {
            const selectedItems = [];
            optionsList.querySelectorAll('li.selected').forEach(li => {
                selectedItems.push(li.getAttribute('data-value'));
            });

            if (selectedItems.length === 0) {
                selectedValSpan.textContent = '請選擇';
            } else if (selectedItems.length === 1) {
                selectedValSpan.textContent = selectedItems[0];
            } else {
                selectedValSpan.textContent = `${selectedItems[0]} + ${selectedItems.length - 1}`;
            }
        }
        
        // Initial run
        updateDisplay();
    }

    // Custom selections state
    let selectedStatusVal = '';
    let selectedLevelVal = '';
    
    initSingleSelect(dropdownStatus, (val) => {
        selectedStatusVal = val;
        updateFilters();
        renderTable();
    });

    initSingleSelect(dropdownLevel, (val) => {
        selectedLevelVal = val;
        updateFilters();
        renderTable();
    });

    initMultiSelect(dropdownVip, () => {
        updateFilters();
        renderTable();
    });

    initMultiSelect(dropdownOther, () => {
        updateFilters();
        renderTable();
    });

    // Advanced Filter Controls
    const selectBirthday = document.getElementById('selectBirthday');
    const inputDateStart = document.getElementById('inputDateStart');
    const inputDateEnd = document.getElementById('inputDateEnd');
    const inputQuickLogin = document.getElementById('inputQuickLogin') || { value: "" };
    const inputUid = document.getElementById('inputUid') || { value: "" };
    const inputInviteCode = document.getElementById('inputInviteCode') || { value: "" };
    const inputNickname = document.getElementById('inputNickname') || { value: "" };
    const inputRealName = document.getElementById('inputRealName') || { value: "" };
    const inputBankCard = document.getElementById('inputBankCard');
    const inputOfflineDays = document.getElementById('inputOfflineDays');
    const inputIp = document.getElementById('inputIp');
    const inputDeposit = document.getElementById('inputDeposit');

    // Actions & Containers
    const btnSearch = document.getElementById('btnSearch');
    const btnClearAll = document.getElementById('btnClearAll');
    const filterTagsContainer = document.getElementById('filterTagsContainer');
    const userTableBody = document.getElementById('userTableBody');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const advancedBadge = document.getElementById('advancedBadge');

    // Drawer state toggle
    function openDrawer() {
        drawer.classList.add('active');
        overlay.classList.add('active');
    }

    function closeDrawer() {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
    }

    openBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Mock Users Database (Aligned statuses & other tags with new values)
    const mockUsers = [
        { uid: "102941", account: "user_test01", realName: "張偉", level: "普通會員", vip: "白银会员", offlineDays: 5, agentId: "AG888", ip: "44.41.2.12", status: "正常", other: "过滤测试账号", birthday: "5月", date: "2026-07-05", quickLogin: "yes", inviteCode: "INV01", nickname: "小張", bankCard: "622202******1234", deposit: 150, tags: ["VIP", "高頻交易"] },
        { uid: "102942", account: "vip_king", realName: "李娜", level: "VIP會員", vip: "钻石会员", offlineDays: 1, agentId: "AG888", ip: "192.168.1.5", status: "正常", other: "已充值玩家", birthday: "8月", date: "2026-07-10", quickLogin: "no", inviteCode: "INV02", nickname: "娜姐", bankCard: "622202******5678", deposit: 5000, tags: ["大戶", "提現快", "優質"] },
        { uid: "102943", account: "gold_mine", realName: "王強", level: "黃金會員", vip: "黄金会员", offlineDays: 12, agentId: "AG999", ip: "203.45.12.89", status: "正常", other: "过滤测试账号", birthday: "5月", date: "2026-07-02", quickLogin: "yes", inviteCode: "INV03", nickname: "強哥", bankCard: "622202******9012", deposit: 800, tags: ["信用極佳"] },
        { uid: "102944", account: "test_temp", realName: "陳靜", level: "普通會員", vip: "白银会员", offlineDays: 45, agentId: "AG111", ip: "8.8.8.8", status: "冻结", other: "过滤测试账号", birthday: "12月", date: "2026-06-25", quickLogin: "no", inviteCode: "INV04", nickname: "小陳", bankCard: "622202******3456", deposit: 50, tags: ["測試帳號", "凍結中"] },
        { uid: "102945", account: "lucky_star", realName: "劉洋", level: "普通會員", vip: "铂金会员", offlineDays: 0, agentId: "AG888", ip: "44.41.2.12", status: "正常", other: "已充值玩家", birthday: "5月", date: "2026-07-12", quickLogin: "yes", inviteCode: "INV05", nickname: "星星", bankCard: "622202******7890", deposit: 1200, tags: ["首充用戶", "活動愛好者", "高存款", "安全提示"] },
        { uid: "102946", account: "shadow_agent", realName: "楊光", level: "VIP會員", vip: "钻石会员", offlineDays: 3, agentId: "AG222", ip: "114.114.114.114", status: "正常", other: "过滤测试账号", birthday: "3月", date: "2026-07-01", quickLogin: "yes", inviteCode: "INV06", nickname: "陽光", bankCard: "622202******2345", deposit: 3000, tags: ["新註冊", "代理"] },
        { uid: "102947", account: "nomad_user", realName: "趙敏", level: "普通會員", vip: "白银会员", offlineDays: 120, agentId: "AG333", ip: "172.16.0.4", status: "停用", other: "过滤测试账号", birthday: "5月", date: "2026-05-15", quickLogin: "no", inviteCode: "INV07", nickname: "敏敏", bankCard: "622202******6789", deposit: 0, tags: ["無活躍"] },
        { uid: "102948", account: "beta_tester", realName: "黃勇", level: "普通會員", vip: "黄金会员", offlineDays: 2, agentId: "AG888", ip: "44.41.2.12", status: "正常", other: "过滤测试账号", birthday: "5月", date: "2026-07-04", quickLogin: "yes", inviteCode: "INV08", nickname: "阿勇", bankCard: "622202******0123", deposit: 250, tags: ["測試", "一般"] },
        { uid: "102949", account: "crypto_whale", realName: "周杰", level: "VIP會員", vip: "至尊会员", offlineDays: 0, agentId: "AG999", ip: "12.34.56.78", status: "正常", other: "已充值玩家", birthday: "10月", date: "2026-07-14", quickLogin: "no", inviteCode: "INV09", nickname: "杰倫", bankCard: "622202******4567", deposit: 25000, tags: ["巨鯨", "常在線"] },
        { uid: "102950", account: "game_master", realName: "吳剛", level: "黃金會員", vip: "黄金会员", offlineDays: 8, agentId: "AG111", ip: "210.33.88.22", status: "正常", other: "已充值玩家", birthday: "2月", date: "2026-07-08", quickLogin: "yes", inviteCode: "INV10", nickname: "剛子", bankCard: "622202******8901", deposit: 1450, tags: ["推廣員"] },
        { uid: "102951", account: "alpha_one", realName: "鄭少", level: "普通會員", vip: "白银会员", offlineDays: 14, agentId: "AG888", ip: "180.12.33.45", status: "停用", other: "过滤测试账号", birthday: "4月", date: "2026-06-30", quickLogin: "no", inviteCode: "INV11", nickname: "阿少", bankCard: "622202******2340", deposit: 100, tags: ["暫停"] },
        { uid: "102952", account: "super_star", realName: "孫悟空", level: "VIP會員", vip: "钻石会员", offlineDays: 0, agentId: "AG222", ip: "220.181.38.148", status: "正常", other: "已充值玩家", birthday: "1月", date: "2026-07-15", quickLogin: "yes", inviteCode: "INV12", nickname: "大聖", bankCard: "622202******6780", deposit: 9999, tags: ["高頻交易", "活躍"] },
        { uid: "102953", account: "piggy_bank", realName: "豬八戒", level: "普通會員", vip: "黄金会员", offlineDays: 18, agentId: "AG333", ip: "116.228.111.45", status: "正常", other: "过滤测试账号", birthday: "6月", date: "2026-07-02", quickLogin: "no", inviteCode: "INV13", nickname: "二師兄", bankCard: "622202******0120", deposit: 50, tags: ["低存款"] },
        { uid: "102954", account: "monk_sha", realName: "沙悟淨", level: "普通會員", vip: "白银会员", offlineDays: 20, agentId: "AG999", ip: "112.64.12.30", status: "正常", other: "已充值玩家", birthday: "11月", date: "2026-06-28", quickLogin: "no", inviteCode: "INV14", nickname: "三師弟", bankCard: "622202******4560", deposit: 300, tags: ["穩健"] },
        { uid: "102955", account: "master_tang", realName: "唐三藏", level: "VIP會員", vip: "至尊会员", offlineDays: 1, agentId: "AG111", ip: "101.226.103.6", status: "正常", other: "已充值玩家", birthday: "9月", date: "2026-07-13", quickLogin: "yes", inviteCode: "INV15", nickname: "師父", bankCard: "622202******8900", deposit: 15000, tags: ["大戶", "團隊長"] }
    ];

    // Helper: Get active selections from multi-select
    function getMultiSelectValues(element) {
        const values = [];
        element.querySelectorAll('.select-options li.selected').forEach(li => {
            values.push(li.getAttribute('data-value'));
        });
        return values;
    }

    // Helper: Reset single select UI to specific value
    function setSingleSelectValue(element, val, text) {
        const selectedValSpan = element.querySelector('.selected-val');
        const optionsList = element.querySelector('.select-options');
        
        optionsList.querySelectorAll('li').forEach(li => {
            if (li.getAttribute('data-value') === val) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });
        selectedValSpan.textContent = text;
    }

    // Helper: Clear multi select choices
    function clearMultiSelectValue(element) {
        const selectedValSpan = element.querySelector('.selected-val');
        const optionsList = element.querySelector('.select-options');
        
        optionsList.querySelectorAll('li').forEach(li => {
            li.classList.remove('selected');
            const checkbox = li.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.checked = false;
        });
        selectedValSpan.textContent = '請選擇';
    }

    // Read form values and update Tags & Badge count
    function updateFilters() {
        const tags = [];
        let advancedCount = 0;

        // 1. Status
        if (selectedStatusVal) {
            tags.push({ key: 'status', label: `狀態: ${selectedStatusVal}`, type: 'single-custom', element: dropdownStatus, defaultValue: '', defaultText: '所有', valueVarSetter: (v) => selectedStatusVal = v });
        }
        // 2. Level
        if (selectedLevelVal) {
            tags.push({ key: 'level', label: `層級: ${selectedLevelVal}`, type: 'single-custom', element: dropdownLevel, defaultValue: '', defaultText: '全部', valueVarSetter: (v) => selectedLevelVal = v });
        }
        // 3. VIP (Multiple Select)
        const selectedVips = getMultiSelectValues(dropdownVip);
        if (selectedVips.length > 0) {
            tags.push({ key: 'vip', label: `等級: ${selectedVips.join(', ')}`, type: 'multi-custom', element: dropdownVip });
        }
        // 4. Other
        const selectedOthers = getMultiSelectValues(dropdownOther);
        if (selectedOthers.length > 0) {
            tags.push({ key: 'other', label: `其他: ${selectedOthers.join(', ')}`, type: 'multi-custom', element: dropdownOther });
        }
        // 5. Account
        if (inputAccount.value.trim()) {
            let labelPrefix = '帳號';
            if (currentAccountType === 'exact') labelPrefix = '帳號(精確)';
            if (currentAccountType === 'fuzzy') labelPrefix = '帳號(模糊)';
            if (currentAccountType === 'multi') labelPrefix = '帳號(多筆)';
            
            tags.push({ key: 'account', label: `${labelPrefix}: ${inputAccount.value.trim()}`, type: 'input', element: inputAccount });
        }

        // Advanced filter fields
        if (selectBirthday.value) {
            tags.push({ key: 'birthday', label: `生日: ${selectBirthday.value}`, type: 'native-select', element: selectBirthday });
            advancedCount++;
        }
        if (inputDateStart.value || inputDateEnd.value) {
            const startStr = inputDateStart.value ? inputDateStart.value.substring(5) : '??';
            const endStr = inputDateEnd.value ? inputDateEnd.value.substring(5) : '??';
            tags.push({ 
                key: 'dateRange', 
                label: `時間: ${startStr} ~ ${endStr}`, 
                type: 'inputs',
                elements: [inputDateStart, inputDateEnd] 
            });
            advancedCount++;
        }
        if (inputQuickLogin.value.trim()) {
            tags.push({ key: 'quickLogin', label: `快速登入: ${inputQuickLogin.value.trim()}`, type: 'input', element: inputQuickLogin });
            advancedCount++;
        }
        if (inputUid.value.trim()) {
            tags.push({ key: 'uid', label: `UID: ${inputUid.value.trim()}`, type: 'input', element: inputUid });
            advancedCount++;
        }
        if (inputInviteCode.value.trim()) {
            tags.push({ key: 'inviteCode', label: `邀請碼: ${inputInviteCode.value.trim()}`, type: 'input', element: inputInviteCode });
            advancedCount++;
        }
        if (inputNickname.value.trim()) {
            tags.push({ key: 'nickname', label: `暱稱: ${inputNickname.value.trim()}`, type: 'input', element: inputNickname });
            advancedCount++;
        }
        if (inputRealName.value.trim()) {
            tags.push({ key: 'realName', label: `姓名: ${inputRealName.value.trim()}`, type: 'input', element: inputRealName });
            advancedCount++;
        }
        if (inputBankCard.value.trim()) {
            tags.push({ key: 'bankCard', label: `銀行卡末碼: *${inputBankCard.value.trim()}`, type: 'input', element: inputBankCard });
            advancedCount++;
        }
        if (inputOfflineDays.value.trim()) {
            tags.push({ key: 'offlineDays', label: `未登入天數 > ${inputOfflineDays.value.trim()}`, type: 'input', element: inputOfflineDays });
            advancedCount++;
        }
        if (inputIp.value.trim()) {
            tags.push({ key: 'ip', label: `IP: ${inputIp.value.trim()}`, type: 'input', element: inputIp });
            advancedCount++;
        }
        if (inputDeposit.value.trim()) {
            tags.push({ key: 'deposit', label: `存款 > $${inputDeposit.value.trim()}`, type: 'input', element: inputDeposit });
            advancedCount++;
        }

        // Render badge count
        advancedBadge.textContent = advancedCount;

        // Render tags
        filterTagsContainer.innerHTML = '';
        tags.forEach(tag => {
            const div = document.createElement('div');
            div.className = 'filter-tag';
            div.textContent = tag.label + ' ';
            
            const closeIcon = document.createElement('i');
            closeIcon.className = 'ph ph-x';
            closeIcon.addEventListener('click', () => {
                // Clear the target fields
                if (tag.type === 'single-custom') {
                    setSingleSelectValue(tag.element, tag.defaultValue, tag.defaultText);
                    tag.valueVarSetter(tag.defaultValue);
                } else if (tag.type === 'multi-custom') {
                    clearMultiSelectValue(tag.element);
                } else if (tag.type === 'inputs') {
                    tag.elements.forEach(el => el.value = '');
                } else if (tag.type === 'native-select') {
                    tag.element.value = '';
                } else {
                    tag.element.value = '';
                }
                updateFilters();
                renderTable();
            });
            
            div.appendChild(closeIcon);
            filterTagsContainer.appendChild(div);
        });
    }

    // Clear all filters
    function clearAllFilters() {
        // Reset selectors
        setSingleSelectValue(dropdownStatus, '', '所有');
        selectedStatusVal = '';
        
        setSingleSelectValue(dropdownLevel, '', '全部');
        selectedLevelVal = '';

        clearMultiSelectValue(dropdownVip);
        clearMultiSelectValue(dropdownOther);
        inputAccount.value = '';

        // Reset advanced
        selectBirthday.value = '';
        inputDateStart.value = '';
        inputDateEnd.value = '';
        inputQuickLogin.value = '';
        inputUid.value = '';
        inputInviteCode.value = '';
        inputNickname.value = '';
        inputRealName.value = '';
        inputBankCard.value = '';
        inputOfflineDays.value = '';
        inputIp.value = '';
        inputDeposit.value = '';

        updateFilters();
        renderTable();
    }

    btnClearAll.addEventListener('click', clearAllFilters);
    btnClearDrawer.addEventListener('click', () => {
        // Only clear advanced fields
        selectBirthday.value = '';
        inputDateStart.value = '';
        inputDateEnd.value = '';
        inputQuickLogin.value = '';
        inputUid.value = '';
        inputInviteCode.value = '';
        inputNickname.value = '';
        inputRealName.value = '';
        inputBankCard.value = '';
        inputOfflineDays.value = '';
        inputIp.value = '';
        inputDeposit.value = '';
        
        updateFilters();
        renderTable();
    });

    // Render Table Data
    function renderTable() {
        const selectedVips = getMultiSelectValues(dropdownVip);
        const selectedOthers = getMultiSelectValues(dropdownOther);
        const accountVal = inputAccount.value.trim().toLowerCase();

        // Advanced filter values (Checking both drawer inputs and outer inputs)
        const selectBirthdayOuter = document.getElementById('selectBirthdayOuter');
        const inputDateStartOuter = document.getElementById('inputDateStartOuter');
        const inputDateEndOuter = document.getElementById('inputDateEndOuter');
        const inputBankCardOuter = document.getElementById('inputBankCardOuter');
        const inputOfflineDaysOuter = document.getElementById('inputOfflineDaysOuter');
        const inputIpOuter = document.getElementById('inputIpOuter');
        const inputDepositOuter = document.getElementById('inputDepositOuter');

        const birthdayVal = selectBirthday.value || (selectBirthdayOuter ? selectBirthdayOuter.value : '');
        const dateStartVal = inputDateStart.value || (inputDateStartOuter ? inputDateStartOuter.value : '');
        const dateEndVal = inputDateEnd.value || (inputDateEndOuter ? inputDateEndOuter.value : '');
        const quickLoginVal = inputQuickLogin.value.trim();
        const uidVal = inputUid.value.trim();
        const inviteCodeVal = inputInviteCode.value.trim();
        const nicknameVal = inputNickname.value.trim().toLowerCase();
        const realNameVal = inputRealName.value.trim();
        const bankCardVal = inputBankCard.value.trim();
        const offlineDaysVal = parseInt(inputOfflineDays.value.trim(), 10);
        const ipVal = inputIp.value.trim();
        const depositVal = parseFloat(inputDeposit.value.trim());

        // Perform Filtering
        const filtered = mockUsers.filter(user => {
            if (selectedStatusVal && user.status !== selectedStatusVal) return false;
            if (selectedLevelVal && user.level !== selectedLevelVal) return false;
            if (selectedVips.length > 0 && !selectedVips.includes(user.vip)) return false;
            if (selectedOthers.length > 0 && !selectedOthers.includes(user.other)) return false;
            
            // Account filter with match type logic
            if (accountVal) {
                if (currentAccountType === 'exact') {
                    if (user.account.toLowerCase() !== accountVal) return false;
                } else if (currentAccountType === 'fuzzy') {
                    if (!user.account.toLowerCase().includes(accountVal)) return false;
                } else if (currentAccountType === 'multi') {
                    const accounts = accountVal.split(';').map(a => a.trim()).filter(Boolean);
                    if (accounts.length > 0 && !accounts.some(acc => user.account.toLowerCase() === acc)) return false;
                } else if (currentAccountType === 'quickLogin') {
                    if (!user.quickLogin || !user.quickLogin.toLowerCase().includes(accountVal)) return false;
                } else if (currentAccountType === 'uid') {
                    if (!user.uid || !user.uid.toLowerCase().includes(accountVal)) return false;
                } else if (currentAccountType === 'inviteCode') {
                    if (!user.inviteCode || !user.inviteCode.toLowerCase().includes(accountVal)) return false;
                } else if (currentAccountType === 'nickname') {
                    if (!user.nickname || !user.nickname.toLowerCase().includes(accountVal)) return false;
                } else if (currentAccountType === 'realName') {
                    if (!user.realName || !user.realName.toLowerCase().includes(accountVal)) return false;
                } else {
                    // For mock properties (email, phone, zalo, fb, wa, tg, remark, googleCode)
                    if (user[currentAccountType] && !user[currentAccountType].toLowerCase().includes(accountVal)) return false;
                }
            }

            // Advanced Filters
            if (birthdayVal && user.birthday !== birthdayVal) return false;
            if (dateStartVal && user.date < dateStartVal) return false;
            if (dateEndVal && user.date > dateEndVal) return false;
            if (quickLoginVal && user.quickLogin !== quickLoginVal) return false;
            if (uidVal && user.uid !== uidVal) return false;
            if (inviteCodeVal && user.inviteCode !== inviteCodeVal) return false;
            if (nicknameVal && !user.nickname.toLowerCase().includes(nicknameVal)) return false;
            if (realNameVal && !user.realName.includes(realNameVal)) return false;
            if (bankCardVal && !user.bankCard.includes(bankCardVal)) return false;
            if (!isNaN(offlineDaysVal) && user.offlineDays <= offlineDaysVal) return false;
            if (ipVal && !user.ip.includes(ipVal)) return false;
            if (!isNaN(depositVal) && user.deposit <= depositVal) return false;

            return true;
        });

        // Generate Rows HTML
        const totalCountSpan = document.getElementById('totalCount');
        if (totalCountSpan) {
            totalCountSpan.textContent = filtered.length;
        }

        userTableBody.innerHTML = '';
        if (filtered.length === 0) {
            userTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px 0;">無符合篩選條件的會員資料</td></tr>`;
            return;
        }

        filtered.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="badge-online ${user.offlineDays === 0 ? 'online' : 'offline'}">${user.offlineDays === 0 ? '在線' : '離線'}</span></td>
                <td>
                    <div class="avatar-cell">
                        <i class="ph-fill ph-user"></i>
                    </div>
                </td>
                <td><input type="checkbox" class="user-checkbox"></td>
                <td>
                    <div class="info-cell">
                        <div><span class="info-label">用戶ID :</span> ${user.uid}</div>
                        <div><span class="info-label">會員名 :</span> ${user.account}</div>
                        <div><span class="info-label">真實姓名 :</span> ${user.realName}</div>
                        <div><span class="info-label">用戶暱稱 :</span> ${user.nickname}</div>
                        <div><span class="info-label">代理 :</span> ${user.agentId}</div>
                        <div><span class="info-label">邀請人 :</span> nntest123556</div>
                        <div><span class="info-label">註冊模式 :</span> 一般註冊</div>
                        <div><span class="info-label">手機號 :</span> 未綁定</div>
                    </div>
                </td>
                <td>
                    <div class="info-cell">
                        <div><span class="info-label">支付層級 :</span> 默認層</div>
                        <div><span class="info-label">成長值 :</span> 0</div>
                        <div><span class="info-label">等級 :</span> ${user.vip}</div>
                        <div><span class="info-label">帳號類型 :</span> 普通帳號</div>
                        <div><span class="info-label">會員類型 :</span> 代理會員</div>
                        <div><span class="info-label">邀請碼 :</span> ${user.inviteCode}</div>
                        <div><span class="info-label">直屬下級/團隊人數 :</span> 0/0</div>
                        <div><span class="info-label">VIP會員等級 :</span> 0</div>
                        <div><span class="info-label">VIP成長值 :</span> 0</div>
                    </div>
                </td>
                <td>
                    <div class="info-cell">
                        <div><span class="info-label">信用值 :</span> 0</div>
                        <div><span class="info-label">可用額度 :</span> 0</div>
                        <div><span class="info-label">佣金餘額 :</span> 0</div>
                        <div><span class="info-label">餘額寶 :</span> 0</div>
                        <div><span class="info-label">欠款 :</span> -</div>
                        <div><span class="info-label">餘額寶利息 :</span> 0</div>
                        <div><span class="info-label">三方餘額 :</span> 0 <a href="#" class="refresh-link">刷新</a></div>
                        <div><span class="info-label">會員積分 :</span> 0</div>
                    </div>
                </td>
                <td>
                    <div class="info-cell">
                        <div><span class="info-label">存款總額 :</span> ${user.deposit}</div>
                        <div><span class="info-label">取款總額 :</span> 0</div>
                        <div><span class="info-label">提款預扣金額 :</span> 0</div>
                        <div><span class="info-label">后台加款總額 :</span> -</div>
                        <div><span class="info-label">后台扣款總額 :</span> -</div>
                        <div><span class="info-label">存款次數 :</span> ${user.deposit > 0 ? 1 : 0}</div>
                        <div><span class="info-label">取款次數 :</span> 0</div>
                    </div>
                </td>
                <td>
                    <div class="user-tags-container">
                        ${(function() {
                            if (!user.tags || user.tags.length === 0) return '';
                            const colors = ['tag-blue', 'tag-green', 'tag-red', 'tag-yellow', 'tag-purple'];
                            let html = '';
                            user.tags.slice(0, 2).forEach((tag, idx) => {
                                const colorClass = colors[idx % colors.length];
                                html += `<span class="user-custom-tag ${colorClass}">${tag}</span>`;
                            });
                            if (user.tags.length > 2) {
                                html += `<span class="user-custom-tag tag-more" title="${user.tags.slice(2).join(', ')}">+</span>`;
                            }
                            return html;
                        })()}
                    </div>
                </td>
                <td><span class="status-label status-${user.status === '正常' ? 'active' : user.status === '冻结' ? 'frozen' : 'disabled'}">${user.status}</span></td>
                <td>
                    <div class="info-cell">
                        <div><span class="info-label">新增時間 :</span> ${user.date} 12:51</div>
                        <div><span class="info-label">最後登錄 :</span> ${user.offlineDays === 0 ? '今天12:51:38' : '3天前'}</div>
                        <div><span class="info-label">離開天數 :</span> ${user.offlineDays}天</div>
                        <div><span class="info-label">登錄IP :</span></div>
                        <div class="ip-row">${user.ip} <i class="ph ph-link text-primary-link"></i> <i class="ph ph-copy text-primary-link"></i></div>
                    </div>
                </td>
                <td>
                    <div class="info-cell">
                        <div><span class="info-label">備註 :</span> -</div>
                        <div><span class="info-label">回訪備註 :</span> -</div>
                        <div><span class="info-label">注 :</span> -</div>
                    </div>
                </td>
                <td>
                    <div class="operations-grid">
                        <a href="#" class="op-link">編輯用戶</a>
                        <a href="#" class="op-link">查看詳情</a>
                        <a href="#" class="op-link">額度修改</a>
                        <a href="#" class="op-link">資金明細</a>
                        <a href="#" class="op-link">注單明細</a>
                        <a href="#" class="op-link">修改密碼</a>
                        <a href="#" class="op-link">下級會員</a>
                        <a href="#" class="op-link">下級報表</a>
                        <a href="#" class="op-link">下級注單</a>
                        <button class="btn-more">更多...</button>
                    </div>
                </td>
            `;
            userTableBody.appendChild(tr);
        });

        // Apply column visibility
        applyColumnVisibility();
    }

    // Column Visibility State
    const columnVisibility = {
        0: true, 1: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true, 10: true, 11: true
    };

    function applyColumnVisibility() {
        Object.keys(columnVisibility).forEach(index => {
            const idx = parseInt(index, 10);
            const cells = document.querySelectorAll(`table tr th:nth-child(${idx + 1}), table tr td:nth-child(${idx + 1})`);
            cells.forEach(cell => {
                cell.style.display = columnVisibility[idx] ? '' : 'none';
            });
        });
        
        // Update visibility count footer
        const visibleCount = Object.values(columnVisibility).filter(Boolean).length;
        const visibleColumnsCountSpan = document.getElementById('visibleColumnsCount');
        if (visibleColumnsCountSpan) {
            visibleColumnsCountSpan.textContent = visibleCount;
        }
    }

    // Column Toggle Controls
    const btnColumnToggle = document.getElementById('btnColumnToggle');
    const columnToggleDropdown = document.getElementById('columnToggleDropdown');
    const columnSearchInput = document.getElementById('columnSearchInput');
    const columnList = document.getElementById('columnList');
    const resetColumns = document.getElementById('resetColumns');

    // Toggle Dropdown
    btnColumnToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = columnToggleDropdown.classList.contains('show');
        closeAllDropdowns();
        if (!isOpen) {
            columnToggleDropdown.classList.add('show');
        }
    });

    // Checkbox changed
    columnList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const colIndex = parseInt(e.target.getAttribute('data-column'), 10);
            columnVisibility[colIndex] = e.target.checked;
            applyColumnVisibility();
        });
    });

    // Reset Defaults
    const resetAction = () => {
        columnList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
            const colIndex = parseInt(checkbox.getAttribute('data-column'), 10);
            columnVisibility[colIndex] = true;
        });
        applyColumnVisibility();
    };
    if (resetColumns) resetColumns.addEventListener('click', resetAction);
    const resetIcon = document.querySelector('.reset-icon');
    if (resetIcon) resetIcon.addEventListener('click', resetAction);

    // Column List Search Filter
    if (columnSearchInput) {
        columnSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            columnList.querySelectorAll('li').forEach(li => {
                const text = li.querySelector('span').textContent.toLowerCase();
                if (text.includes(query)) {
                    li.style.display = '';
                } else {
                    li.style.display = 'none';
                }
            });
        });
    }

    // Select all logic
    selectAllCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.user-checkbox');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
    });

    // Search events
    btnSearch.addEventListener('click', () => {
        updateFilters();
        renderTable();
    });
    btnApply.addEventListener('click', () => {
        updateFilters();
        renderTable();
        closeDrawer();
    });

    // Outer fields change listeners to trigger search
    const selectBirthdayOuter = document.getElementById('selectBirthdayOuter');
    if (selectBirthdayOuter) selectBirthdayOuter.addEventListener('change', () => { updateFilters(); renderTable(); });
    
    const inputDateStartOuter = document.getElementById('inputDateStartOuter');
    if (inputDateStartOuter) inputDateStartOuter.addEventListener('change', () => { updateFilters(); renderTable(); });
    
    const inputDateEndOuter = document.getElementById('inputDateEndOuter');
    if (inputDateEndOuter) inputDateEndOuter.addEventListener('change', () => { updateFilters(); renderTable(); });
    
    const inputBankCardOuter = document.getElementById('inputBankCardOuter');
    if (inputBankCardOuter) inputBankCardOuter.addEventListener('input', () => { updateFilters(); renderTable(); });
    
    const inputOfflineDaysOuter = document.getElementById('inputOfflineDaysOuter');
    if (inputOfflineDaysOuter) inputOfflineDaysOuter.addEventListener('input', () => { updateFilters(); renderTable(); });
    
    const inputIpOuter = document.getElementById('inputIpOuter');
    if (inputIpOuter) inputIpOuter.addEventListener('input', () => { updateFilters(); renderTable(); });
    
    const inputDepositOuter = document.getElementById('inputDepositOuter');
    if (inputDepositOuter) inputDepositOuter.addEventListener('input', () => { updateFilters(); renderTable(); });

    // Sticky header with collapsible filter card logic using IntersectionObserver
    const anchor = document.getElementById('filter-scroll-anchor');
    const filterCard = document.querySelector('.filter-card');
    if (anchor && filterCard) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.boundingClientRect.top < 0 && !entry.isIntersecting) {
                    filterCard.classList.add('collapsed-sticky');
                } else {
                    filterCard.classList.remove('collapsed-sticky');
                }
            });
        }, {
            root: null,
            threshold: 0,
            rootMargin: '-170px 0px 0px 0px'
        });
        observer.observe(anchor);
    }

    // Sidebar Group Collapse/Expand Toggles
    const navHeaders = document.querySelectorAll('.nav-item-header');
    navHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const group = header.parentElement;
            const arrow = header.querySelector('.toggle-arrow');
            
            // Toggle expanded class
            const isExpanded = group.classList.toggle('expanded');
            
            // Update arrow icon class
            if (arrow) {
                if (isExpanded) {
                    arrow.classList.remove('ph-caret-down');
                    arrow.classList.add('ph-caret-up');
                } else {
                    arrow.classList.remove('ph-caret-up');
                    arrow.classList.add('ph-caret-down');
                }
            }
        });
    });

    // Dynamic local time display
    const timeSpan = document.getElementById('currentLocalTime');
    if (timeSpan) {
        const updateTime = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const date = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            timeSpan.textContent = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    // Initialize UI
    updateFilters();
    renderTable();
});
